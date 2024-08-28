import {
   AbstractStorageAdapter,
   Core,
   FileType,
   FileResponseLink,
   FileResponseUrl,
   StorageParameters,
   DownloadFileMeta,
} from '@quatrain/core'
import sharp from 'sharp'
import { join } from 'path'
import { tmpdir } from 'os'
import fs from 'fs-extra'
import hash from 'object-hash'
import { Readable, Stream } from 'stream'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createReadStream, createWriteStream } from 'fs'
import {
   S3Client,
   PutObjectCommand,
   GetObjectCommand,
   DeleteObjectCommand,
   CopyObjectCommand,
} from '@aws-sdk/client-s3'

export class AwsStorageAdapter extends AbstractStorageAdapter {
   protected _client: S3Client

   constructor(params: StorageParameters) {
      super(params)

      const config = {
         region: this._params.config.region,
         credentials: {
            accessKeyId: this._params.config.accesskey,
            secretAccessKey: this._params.config.secret,
         },
      }

      this._client = new S3Client(config)
      Core.log(`[ASA] AWS Storage Adapter initialized`)
   }

   getDriver() {
      return this._client
   }

   async streamToBuffer(stream: Stream): Promise<Buffer> {
      return new Promise<Buffer>((resolve, reject) => {
         const _buf: any[] = []

         stream.on('data', (chunk) => _buf.push(chunk))
         stream.on('end', () => resolve(Buffer.concat(_buf)))
         stream.on('error', (err) => reject(err))
      })
   }

   async create(file: FileType, stream: Readable): Promise<FileType> {
      const input = {
         Bucket: file.bucket || this._params.config.bucket,
         Key: file.ref,
         Body: await this.streamToBuffer(stream),
         ContentType: file.contentType,
      }
      Core.log(`Uploading ${file.ref} to ${file.bucket}`)

      const command = new PutObjectCommand(input)
      await this._client?.send(command)

      return file
   }

   async copy(file: FileType, destFile: FileType) {
      const command = new CopyObjectCommand({
         CopySource: file.ref,
         Bucket: destFile.ref,
         Key: 'NEW_OBJECT_KEY',
      })

      try {
         const response = await this._client.send(command)
         console.log(response)
      } catch (err) {
         console.error(err)
      }
   }

   async getUrl(file: FileType, expiresIn = 3600) {
      //   return await awsS3.getPublicUrl(file, expiresIn)

      const command = new GetObjectCommand({
         Bucket: file.bucket,
         Key: file.ref,
      })
      const url = await getSignedUrl(this._client, command, { expiresIn })
      return { url, expiresIn }
   }

   async delete(file: FileType) {
      // return !!(await awsS3.deleteFile(file))
      const command = new DeleteObjectCommand({
         Bucket: file.bucket,
         Key: file.ref,
      })

      const data = await this._client?.send(command)
      Core.log('Success. Object deleted.')

      return true
   }

   async getReadable(file: FileType): Promise<Readable> {
      Core.log('GET Readable :', file.ref)
      const command = new GetObjectCommand({
         Bucket: file.bucket || this._params.config.bucket,
         Key: file.ref,
      })
      const item = await this._client?.send(command)
      const ByteArray: any = await item?.Body?.transformToByteArray()
      const buffer = Buffer.from(ByteArray, 'base64')
      const readable = new Readable()
      readable.push(buffer)
      readable.push(null)

      return readable
   }

   async stream(file: FileType, res: any) {
      //return awsS3.streamFile(file, res)
      const command = new GetObjectCommand({
         Bucket: file.bucket,
         Key: file.ref,
      })
      const item = await this._client.send(command)
      const ByteArray: any = await item.Body?.transformToByteArray()
      const buffer = Buffer.from(ByteArray, 'base64')
      const readable = new Readable()
      readable.push(buffer)
      readable.push(null)

      return readable.pipe(res)
   }

   async generateVideoThumbnail(file: FileType, sizes: number[]): Promise<any> {
      const name = file.name || file.ref
      const thumbnails: any = {}

      const workingDir = join(tmpdir(), 'videothumbs')
      await fs.ensureDir(workingDir)

      const extension = name.split('.').pop()
      const tmpFilePath = join(workingDir, hash(name)) + `.${extension}`

      await this.download(file, { path: tmpFilePath })
      const bucketDir = name.substring(0, name.lastIndexOf('/'))

      const pspawn = require('child-process-promise').spawn

      try {
         await Promise.all(
            sizes.map(async (size) => {
               const locatThmbFilePath = `${tmpFilePath}.thumb${size}.png`
               await pspawn('ffmpeg', [
                  '-i',
                  tmpFilePath,
                  '-vframes',
                  '1',
                  '-an',
                  '-s',
                  `${size}x${Math.ceil(size * 0.7)}`,
                  '-ss',
                  '1',
                  locatThmbFilePath,
               ])
               const thumbName = `thumb${size}`
               const thumbPath = join(workingDir, thumbName) + `.png`
               await sharp(locatThmbFilePath)
                  .resize(size, size, {
                     fit: 'contain',
                     background: { r: 255, g: 255, b: 255, alpha: 1 },
                  })
                  .toFile(thumbPath)

               thumbnails[thumbName] = join(bucketDir, `${thumbName}.png`)

               const Body = createReadStream(thumbPath)
               const command = new PutObjectCommand({
                  Bucket: file.bucket || this._params.config.s3Bucket,
                  Key: join(bucketDir, `${thumbName}.png`),
                  Body,
               })
               return this._client?.send(command)
            })
         )
      } catch (e) {
         console.error(e)
      }

      return thumbnails
   }

   async download(file: FileType, meta: DownloadFileMeta) {
      const stream: Readable = await this.getReadable(file)
      await new Promise((res) =>
         stream.pipe(createWriteStream(meta.path)).on('close', res)
      )

      return meta.path
   }

   async generateImageThumbnail(file: FileType, sizes: number[]): Promise<any> {
      const name = file.name || file.ref
      const thumbnails: any = {}
      const workingDir = join(tmpdir(), 'thumbs')

      const extension = name.split('.').pop().toLowerCase()
      const path = join(workingDir, hash(name)) + `.${extension}`

      await fs.ensureDir(workingDir)

      try {
         await fs.ensureDir(workingDir)

         // get File directory
         const bucketDir = name.substring(0, name.lastIndexOf('/'))
         await this.download(file, { path })

         const uploadPromises = sizes.map(async (size) => {
            const thumbName = `thumb${size}`
            const thumbPath = join(workingDir, thumbName) + `.${extension}`
            await sharp(path)
               .resize(size, size, {
                  fit: 'contain',
                  background: { r: 255, g: 255, b: 255, alpha: 1 },
               })
               .toFile(thumbPath)
            thumbnails[thumbName] = join(bucketDir, thumbName) + `.${extension}`
            Core.log(`Generating ${size} thumbnail for ${name}`)

            const Body = createReadStream(thumbPath)
            const command = new PutObjectCommand({
               Bucket: file.bucket || this._params.config.bucket,
               Key: join(bucketDir, thumbName) + `.${extension}`,
               Body,
            })
            return this._client.send(command)
         })
         await Promise.all(uploadPromises)
         await fs.remove(workingDir)
      } catch (err) {
         Core.log(
            `Thumbnail generation for ${file.name} failed with error: ${err}`
         )
      }

      return thumbnails
   }

   async generateThumbnail(file: FileType, sizes: number[]): Promise<any> {
      const [type] = file.contentType
         ? file.contentType.split('/')
         : 'application/octet-stream'
      let thumbnails: any = {}

      try {
         // generate thumbnail
         switch (type) {
            case 'image':
               thumbnails = {
                  ...thumbnails,
                  ...(await this.generateImageThumbnail(file, sizes)),
               }
               break

            case 'video':
               thumbnails = {
                  ...thumbnails,
                  ...(await this.generateVideoThumbnail(file, sizes)),
               }
               break

            case 'application':
               console.log(`Processing possible missed image: ${file.ref}`)
               if (
                  file &&
                  file.ref &&
                  file?.ref.split('.').pop()?.toLowerCase() === 'jpg'
               ) {
                  thumbnails = {
                     ...thumbnails,
                     ...(await this.generateImageThumbnail(file, sizes)),
                  }
               }
               break

            default:
               console.log(
                  `${file.name} type (${file.contentType}) can't be thumbnailed!`
               )
               break
         }
      } catch (err) {
         console.log(err)
         console.log(
            `Thumbnail generation for ${file.ref} failed with error: ${err}`
         )
      }

      return thumbnails
   }

   async getUploadUrl(
      file: FileType,
      expiresIn = 3600
   ): Promise<FileResponseLink> {
      const input = {
         Bucket: file.bucket || this._params.config.bucket,
         Key: file.ref,
      }
      const command = new PutObjectCommand(input)

      const url = await getSignedUrl(this._client, command, { expiresIn })

      return {
         href: url,
         type: 'PUT',
         accept: file.contentType || 'application/octet-stream',
         expiresIn,
      }
   }
}
