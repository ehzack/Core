import { Readable } from 'stream'
import { FileType } from './types/FileType'
import { StorageAdapterInterface } from './StorageAdapterInterface'
import { DownloadFileMetaType } from './types/DownloadFileMetaType'
import { Storage, StorageParameters } from './Storage'

import { createReadStream } from 'fs'
import sharp from 'sharp'
import { join } from 'path'
import { tmpdir } from 'os'
import fs from 'fs-extra'
import hash from 'object-hash'

export abstract class AbstractStorageAdapter
   implements StorageAdapterInterface
{
   static readonly FFMPEG = '/usr/bin/ffmpeg'

   protected _client: any
   protected _alias: string = ''
   protected _params: StorageParameters = {}

   constructor(params: StorageParameters = {}) {
      this._alias = params.alias || ''
      this._params = params
   }

   abstract getDriver(): any

   abstract create(file: FileType, stream: Readable): Promise<FileType>

   abstract download(file: FileType, path: DownloadFileMetaType): Promise<any>

   abstract copy(file: FileType, destFile: FileType): Promise<any>

   abstract move(file: FileType, destFile: FileType): Promise<any>

   abstract getUrl(
      file: FileType,
      expiresIn?: number,
      action?: string,
      extra?: any
   ): Promise<any>

   abstract delete(file: FileType): Promise<Boolean>

   abstract stream(file: FileType, res: any): Promise<any>

   abstract getUploadUrl(filePath: FileType, expiresIn?: number): Promise<any>

   abstract getReadable(file: FileType): Promise<Readable>

   abstract getMetaData(file: FileType): Promise<FileType>

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
            Storage.log(`Generating ${size} thumbnail for ${name}`)

            this.create(
               {
                  ...file,
                  ref: join(bucketDir, thumbName) + `.${extension}`,
               },
               createReadStream(thumbPath)
            )
         })
         await Promise.all(uploadPromises)
         await fs.remove(workingDir)
      } catch (err) {
         Storage.log(
            `Thumbnail generation for ${file.name} failed with error: ${err}`
         )
      }

      return thumbnails
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
               await pspawn(AbstractStorageAdapter.FFMPEG, [
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

               this.create(
                  {
                     ...file,
                     ref: join(bucketDir, `${thumbName}.png`),
                  },
                  createReadStream(thumbPath)
               )
            })
         )
      } catch (e) {
         console.error(e)
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
         Storage.log(
            `Thumbnail generation for ${file.ref} failed with error: ${err}`
         )
      }

      return thumbnails
   }
}
