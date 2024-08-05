import admin from 'firebase-admin'
import {
   AbstractStorageAdapter,
   FileType,
   FileResponseUrl,
   FileResponseLink,
} from '@quatrain/core'
import sharp from 'sharp'
import { join } from 'path'
import { tmpdir } from 'os'
import fs from 'fs-extra'
import hash from 'object-hash'
import { Readable } from 'stream'

export class GoogleStorageAdapter extends AbstractStorageAdapter {
   async download(file: FileType, path: string) {
      const bucket = admin.storage().bucket(file.bucket)
      await bucket.file(file.ref).download({ destination: path })

      return path
   }

   async create(File: FileType, stream: Readable): Promise<FileType> {
      const file = admin.storage().bucket(File.bucket).file(File.ref)
      const writeStream = file.createWriteStream({})
      const pipelineFinished = await new Promise((resolve, reject) => {
         stream
            .pipe(writeStream)
            .on('error', (error) => {
               reject(error)
            })
            .on('finish', () => {
               resolve('Stream uploaded successfully!')
            })
      })
      await pipelineFinished

      return File
   }

   async getUrl(
      fileData: FileType,
      expiresIn: number = 7200,
      action?: string,
      extra?: any
   ): Promise<FileResponseUrl> {
      var expires = new Date()
      expires.setSeconds(expires.getSeconds() + expiresIn)

      const [file] = await admin
         .storage()
         .bucket(fileData.bucket)
         .file(fileData.ref)
         .getSignedUrl({
            action,
            expires,
            ...extra,
         })

      return {
         url: file,
         expiresIn: parseInt((expires.valueOf() / 1000).toFixed(0)),
      }
   }

   async delete(file: FileType) {
      const { bucket, ref } = file
      console.log(`${bucket} Removing linked file '${ref}' in `)

      try {
         await admin.storage().bucket(bucket).file(ref).delete()
         return true
      } catch (err) {
         console.log(
            ` Error while removing linked file '${ref}': ${
               (err as Error).message
            }`
         )
      }
      return false
   }

   async stream(file: FileType, res: any) {
      const bucket = admin.storage().bucket()

      return bucket.file(file.ref).createReadStream().pipe(res)
   }

   async getUploadUrl(
      file: FileType,
      duration: number = 3600
   ): Promise<FileResponseLink> {
      const { url, expiresIn } = await this.getUrl(file, duration, 'write', {
         version: 'v4',
         virtualHostedStyle: true,
      })

      return {
         href: url,
         type: 'PUT',
         accept: file.contentType || 'application/octet-stream',
         expiresIn,
      }
   }

   async getReadable(file: FileType): Promise<Readable> {
      console.log('Get readable of file', file.ref)
      const fileRef = admin.storage().bucket(file.bucket).file(file.ref)
      const [exists] = await fileRef.exists()

      if (!exists) {
         throw new Error(`The file ${file.ref} does not exist!`)
      }
      const fileStream = fileRef.createReadStream()
      let fileContents = Buffer.from('')
      const pipelineFinished = await new Promise((resolve, reject) => {
         fileStream.on('data', (chunk: any) => {
            fileContents = Buffer.concat([fileContents, chunk])
            console.log(`Received chunk with ${chunk.length} bytes`)
         })
         fileStream.on('error', (error: any) => {
            console.error('Error reading file stream:', error)
         })
         fileStream.on('end', () => {
            console.log('File stream ended.')

            resolve('File stream ended.')
         })
      })
      await pipelineFinished

      console.log('Readable Length:', fileContents.length)
      const FileReadable = Readable.from(fileContents)
      console.log('FileReadable length :', FileReadable.readableLength)
      return FileReadable
   }

   async generateVideoThumbnail(file: FileType, sizes: number[]): Promise<any> {
      const name = file.name || file.ref
      const thumbnails: any = {}

      const workingDir = join(tmpdir(), 'videothumbs')
      await fs.ensureDir(workingDir)

      const bucket = admin.storage().bucket(file.bucket)
      const extension = name.split('.').pop()
      const tmpFilePath = join(workingDir, hash(name)) + `.${extension}`

      await bucket.file(name).download({ destination: tmpFilePath })
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
               await bucket.upload(thumbPath, {
                  destination: join(bucketDir, `${thumbName}.png`),
               })
               thumbnails[thumbName] = join(bucketDir, `${thumbName}.png`)
            })
         )
      } catch (e) {
         console.error(e)
      }

      return thumbnails
   }

   async generateImageThumbnail(file: FileType, sizes: number[]): Promise<any> {
      const name = file.name || file.ref
      const thumbnails: any = {}
      const workingDir = join(tmpdir(), 'thumbs')
      const extension = name.split('.').pop().toLowerCase()
      const tmpFilePath = join(workingDir, hash(name)) + `.${extension}`

      await fs.ensureDir(workingDir)

      const bucket = admin.storage().bucket(file.bucket)

      try {
         await fs.ensureDir(workingDir)

         // get File directory
         const bucketDir = name.substring(0, name.lastIndexOf('/'))
         await bucket.file(name).download({ destination: tmpFilePath })

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
            return bucket.upload(thumbPath, {
               destination: join(bucketDir, thumbName) + `.${extension}`,
            })
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
}
