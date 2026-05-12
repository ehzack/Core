import { getMediaBuffer, setMediaBuffer } from './cache'
import { Api } from '@quatrain/api'

import { API_UPSTREAM_URL, MAX_CACHE_SIZE_MB, GATEWAY_EXCLUDED_MIMES, GATEWAY_MAXSIZE, GATEWAY_CACHE_MAX_AGE } from './config'

/**
 * Handles incoming HTTP requests for media files (e.g. /api/medias/:uid/file).
 * Contacts the upstream API to authorize the request and retrieve a signed Storage URL.
 * Depending on the file size and type, it either:
 * - Redirects directly to Storage (if the MIME type is excluded or size exceeds MAX_CACHE_SIZE_MB/GATEWAY_MAXSIZE)
 * - Streams the file transparently from Storage
 * - Buffers it into Redis for subsequent fast delivery (if cacheable).
 * 
 * @param req - The incoming Fetch API Request object.
 * @param url - The parsed URL object for the incoming request.
 * @returns A promise resolving to a Fetch API Response object containing the media stream or an error message.
 */
export async function handleMediaRequest(req: Request, url: URL): Promise<Response> {
  Api.info(`[MediaProxy] Received request for ${url.pathname}`)
  const authHeader = req.headers.get('authorization')
  
  // Extract UID and action from the path. Assuming: /api/medias/:uid/file
  // Parts: ['', 'api', 'medias', 'UID', 'ACTION']
  const pathParts = url.pathname.split('/')
  const uid = pathParts[3]
  const action = pathParts[4] || 'file'

  if (!uid) {
    return new Response('Missing UID', { status: 400 })
  }

  // Default immutable caching headers for static media
  const responseHeaders = new Headers({
    'Cache-Control': `public, max-age=${GATEWAY_CACHE_MAX_AGE}, immutable`,
    'Content-Type': 'application/octet-stream',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  })

  // Immediately return 204 for OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: responseHeaders })
  }

  // 1. Call upstream server /internal endpoint
  const authEndpoint = `${API_UPSTREAM_URL}/internal/medias/${uid}?action=${action}`
  const gatewaySecret = process.env.GATEWAY_SECRET
  
  let authRes: Response
  try {
    authRes = await fetch(authEndpoint, {
      headers: { 
        'X-Gateway-Secret': gatewaySecret || '',
        'Authorization': authHeader || ''
      }
    })
  } catch (err) {
    Api.error(`[MediaProxy] Failed to contact upstream internal API:`, err)
    return new Response('Gateway Error', { status: 502 })
  }

  if (!authRes.ok) {
    // Return the upstream's error (e.g. 403 Forbidden)
    return new Response(authRes.body, { status: authRes.status, headers: authRes.headers })
  }

  const mediaInfo = await authRes.json()
  const storageUrl = mediaInfo.url
  const mimeType = mediaInfo.mimeType || 'application/octet-stream'
  const size = mediaInfo.size || 0

  if (!storageUrl) {
    return new Response('No media URL provided by API', { status: 404 })
  }

  // 1.5. Check Excluded Mimes and Size
  const sizeMB = (size / (1024 * 1024)).toFixed(2)
  
  if (GATEWAY_EXCLUDED_MIMES.includes(mimeType)) {
    Api.info(`[MediaProxy] Strategy: REDIRECTION | Reason: Excluded MIME (${mimeType}) | Size: ${sizeMB} MB`)
    return Response.redirect(storageUrl, 302)
  }
  
  if (GATEWAY_MAXSIZE !== null && size > GATEWAY_MAXSIZE) {
    const maxSizeMB = (GATEWAY_MAXSIZE / (1024 * 1024)).toFixed(2)
    Api.info(`[MediaProxy] Strategy: REDIRECTION | Reason: Size exceeds GATEWAY_MAXSIZE (${sizeMB} MB > ${maxSizeMB} MB)`)
    return Response.redirect(storageUrl, 302)
  }

  const isImage = mimeType.startsWith('image/')
  const shouldCache = isImage && (size / (1024 * 1024)) <= MAX_CACHE_SIZE_MB

  Api.info(`[MediaProxy] Strategy: STREAMING | Size: ${sizeMB} MB | MIME: ${mimeType} | Caching: ${shouldCache}`)

  // Update response content type from metadata
  responseHeaders.set('Content-Type', mimeType)

  // 2. Fetch from Storage (with Redis cache if applicable)
  const cacheKey = `media:${uid}:${action}`

  if (shouldCache) {
    // Try to get from Redis
    const cachedBuffer = await getMediaBuffer(cacheKey)
    if (cachedBuffer) {
      Api.info(`[MediaProxy] Cache HIT for ${cacheKey}`)
      return new Response(cachedBuffer, { headers: responseHeaders })
    }
  }

  Api.info(`[MediaProxy] Proxying stream from Storage for ${uid} (cache=${shouldCache})`)
  
  let storageRes: Response
  try {
    storageRes = await fetch(storageUrl)
  } catch (err) {
    Api.error(`[MediaProxy] Failed to fetch from Storage:`, err)
    return new Response('Failed to download media', { status: 502 })
  }

  if (!storageRes.ok) {
    return new Response('Storage Error', { status: storageRes.status })
  }

  if (shouldCache) {
    // To cache it, we must read it into a buffer
    const arrayBuffer = await storageRes.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Save to Redis asynchronously
    setMediaBuffer(cacheKey, buffer, GATEWAY_CACHE_MAX_AGE)
    
    return new Response(buffer, { headers: responseHeaders })
  }

  // 3. Direct Streaming (Zero-Copy-ish)
  // Bun optimizes streaming Responses heavily.
  return new Response(storageRes.body, { headers: responseHeaders })
}
