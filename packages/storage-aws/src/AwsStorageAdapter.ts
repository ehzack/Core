import {
   AbstractStorageAdapter,
   Core,
   FileType,
   FileResponseLink,
} from '@quatrain/core'
import * as awsS3 from './s3'
import sharp from 'sharp'
import { join } from 'path'
import { tmpdir } from 'os'
import fs from 'fs-extra'
import hash from 'object-hash'
import { Readable, Stream } from 'stream'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createReadStream, createWriteStream } from 'fs'

const streamToBuffer = async (stream: Stream): Promise<Buffer> => {
   return new Promise<Buffer>((resolve, reject) => {
      const _buf: any[] = []

      stream.on('data', (chunk) => _buf.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(_buf)))
      stream.on('error', (err) => reject(err))
   })
}

export class AwsStorageAdapter extends AbstractStorageAdapter {
   async create(file: FileType, stream: Readable): Promise<FileType> {
      const input = {
         Bucket: file.bucket || awsS3.s3Bucket,
         Key: file.ref,
         Body: await streamToBuffer(stream),
         ContentType: file.contentType,
      }
      Core.log(`Uploading ${file.ref} to ${file.bucket}`)

      const command = new PutObjectCommand(input)
      await awsS3.s3Client.send(command)

      return file
   }

   async getUrl(file: FileType, expiresIn = 3600) {
      return await awsS3.getPublicUrl(file, expiresIn)
   }

   async delete(file: FileType) {
      return !!(await awsS3.deleteFile(file))
   }

   async getReadable(file: FileType): Promise<Readable> {
      console.log('GET Readable :', file)
      const command = new GetObjectCommand({
         Bucket: file.bucket || awsS3.s3Bucket,
         Key: file.ref,
      })
      const item = await awsS3.s3Client.send(command)
      const ByteArray: any = await item.Body?.transformToByteArray()
      const buffer = Buffer.from(ByteArray, 'base64')
      const readable = new Readable()
      readable.push(buffer)
      readable.push(null)
      return readable
   }

   async stream(file: FileType, res: any) {
      return awsS3.streamFile(file, res)
   }

   async generateVideoThumbnail(file: FileType, sizes: number[]): Promise<any> {
      const name = file.name || file.ref
      const thumbnails: any = {}

      const workingDir = join(tmpdir(), 'videothumbs')
      await fs.ensureDir(workingDir)

      const extension = name.split('.').pop()
      const tmpFilePath = join(workingDir, hash(name)) + `.${extension}`

      await this.download(file, tmpFilePath)
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
                  Bucket: file.bucket || awsS3.s3Bucket,
                  Key: join(bucketDir, `${thumbName}.png`),
                  Body,
               })
               return awsS3.s3Client.send(command)
            })
         )
      } catch (e) {
         console.error(e)
      }

      return thumbnails
   }

   async download(file: FileType, path: string) {
      const stream: Readable = await this.getReadable(file)
      await new Promise((res) =>
         stream.pipe(createWriteStream(path)).on('close', res)
      )

      return path
   }

   async generateImageThumbnail(file: FileType, sizes: number[]): Promise<any> {
      const name = file.name || file.ref
      const thumbnails: any = {}
      const workingDir = join(tmpdir(), 'thumbs')

      const extension = name.split('.').pop().toLowerCase()
      const tmpFilePath = join(workingDir, hash(name)) + `.${extension}`

      await fs.ensureDir(workingDir)

      try {
         await fs.ensureDir(workingDir)

         // get File directory
         const bucketDir = name.substring(0, name.lastIndexOf('/'))
         await this.download(file, tmpFilePath)

         const uploadPromises = sizes.map(async (size) => {
            const thumbName = `thumb${size}`
            const thumbPath = join(workingDir, thumbName) + `.${extension}`
            await sharp(tmpFilePath)
               .resize(size, size, {
                  fit: 'contain',
                  background: { r: 255, g: 255, b: 255, alpha: 1 },
               })
               .toFile(thumbPath)
            thumbnails[thumbName] = join(bucketDir, thumbName) + `.${extension}`
            console.log(`Generating ${size} thumbnail for ${name}`)

            const Body = createReadStream(thumbPath)
            const command = new PutObjectCommand({
               Bucket: file.bucket || awsS3.s3Bucket,
               Key: join(bucketDir, thumbName) + `.${extension}`,
               Body,
            })
            return awsS3.s3Client.send(command)
         })
         await Promise.all(uploadPromises)
         await fs.remove(workingDir)
      } catch (err) {
         console.log(
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
         Bucket: file.bucket || awsS3.s3Bucket,
         Key: file.ref,
      }
      const command = new PutObjectCommand(input)

      const url = await getSignedUrl(awsS3.s3Client, command, { expiresIn })

      return {
         href: url,
         type: 'PUT',
         accept: file.contentType || 'application/octet-stream',
         expiresIn,
      }
   }
}
