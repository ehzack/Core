import { Router, Request, Response, NextFunction } from 'express'

export interface MediaResolution {
  url: string
  size?: number
  mimeType?: string
}

export interface GatewayRouterOptions {
  /**
   * The shared secret used to authenticate requests from the API Gateway.
   * If not provided, it will log a warning and accept any request (not recommended for production).
   */
  secret?: string
  
  /**
   * Callback to resolve the media location.
   * @param req The Express request object, which contains original headers like 'x-user-token' if passed by Gateway.
   * @param uid The unique identifier of the media.
   * @param action The requested action (e.g., 'file', 'thumbnail').
   * @returns A promise resolving to the media resolution object.
   */
  onResolveMedia: (req: Request, uid: string, action: string) => Promise<MediaResolution | null>
}

/**
 * Creates an Express router configured to handle internal API Gateway requests.
 * 
 * @param options Configuration options including the shared secret and resolution callback.
 * @returns An Express Router instance.
 */
export function createGatewayRouter(options: GatewayRouterOptions): Router {
  const router = Router()
  
  if (options.secret) {
    console.log(`[GatewayUpstream] Initialized with secret (length: ${options.secret.length})`)
  } else {
    console.warn('[GatewayUpstream] No secret configured. This internal endpoint is unsecured.')
  }

  // Middleware to validate the gateway secret
  router.use((req: Request, res: Response, next: NextFunction) => {
    if (options.secret) {
      const secretHeader = req.headers['x-gateway-secret']
      if (!secretHeader || secretHeader !== options.secret) {
        console.error(`[GatewayUpstream] Forbidden: Invalid Gateway Secret. Expected length: ${options.secret.length}, Received: ${secretHeader ? 'length ' + secretHeader.length : 'none'}`)
        return res.status(403).json({ error: 'Forbidden: Invalid Gateway Secret' })
      }
    }
    next()
  })

  // Blob resolution endpoint
  router.get('/:uid(*)', async (req: Request, res: Response) => {
    try {
      const uid = req.params.uid
      const action = (req.query.action as string) || 'file'

      if (!uid) {
        return res.status(400).json({ error: 'Missing UID' })
      }

      const mediaResolution = await options.onResolveMedia(req, uid, action)

      if (!mediaResolution || !mediaResolution.url) {
        return res.status(404).json({ error: 'Media not found or no URL resolved' })
      }

      return res.json(mediaResolution)
    } catch (err: any) {
      console.error(`[GatewayUpstream] Error resolving media: ${err.message}`)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  return router
}
