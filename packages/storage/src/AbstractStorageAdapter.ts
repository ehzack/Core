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
import { Core } from '@quatrain/core'

export abstract class AbstractStorageAdapter
   implements StorageAdapterInterface
{
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

   abstract delete(file: FileType): Promise<boolean>

   abstract stream(file: FileType, res: any): Promise<any>

   abstract getUploadUrl(filePath: FileType, expiresIn?: number): Promise<any>

   abstract getReadable(file: FileType): Promise<Readable>

   abstract getMetaData(file: FileType): Promise<FileType>

   async generateImageThumbnail(file: FileType, sizes: number[]): Promise<any> {
      Storage.info(`Generating image thumbnail(s) for ${file.ref}`)
      const name = file.name || file.ref
      const thumbnails: any = {}
      const workingDir = join(tmpdir(), 'thumbs')

      const extension = name.split('.').pop().toLowerCase()
      const path = join(workingDir, hash(name)) + `.${extension}`
      const thumbnailExtension = 'png'

      await fs.ensureDir(workingDir)

      try {
         await fs.ensureDir(workingDir)

         // get File directory
         const bucketDir = name.substring(0, name.lastIndexOf('/'))
         await this.download(file, { path })

         const uploadPromises = sizes.map(async (size) => {
            const thumbName = `thumb${size}`
            const thumbPath =
               join(workingDir, thumbName) + `.${thumbnailExtension}`
            await sharp(path)
               .resize(size, size, {
                  fit: 'contain',
                  background: { r: 255, g: 255, b: 255, alpha: 1 },
               })
               .toFile(thumbPath)
            thumbnails[thumbName] =
               join(bucketDir, thumbName) + `.${thumbnailExtension}`
            Storage.debug(`Generating ${size} thumbnail for ${name}`)

            this.create(
               {
                  ...file,
                  ref: join(bucketDir, thumbName) + `.${thumbnailExtension}`,
               },
               createReadStream(thumbPath)
            )
         })
         await Promise.all(uploadPromises)
         await fs.remove(workingDir)
      } catch (err) {
         Storage.error(
            `Thumbnail generation for ${file.name} failed with error: ${err}`
         )
      }

      return thumbnails
   }

   async generateVideoThumbnail(file: FileType, sizes: number[]): Promise<any> {
      Storage.info(`Generating video thumbnail(s) for ${file.ref}`)

      const name = file.name || file.ref
      const thumbnails: any = {}

      const workingDir = join(tmpdir(), 'videothumbs')
      await fs.ensureDir(workingDir)

      const extension = name.split('.').pop()
      const tmpFilePath = join(workingDir, hash(name)) + `.${extension}`

      await this.download(file, { path: tmpFilePath })
      const bucketDir = name.substring(0, name.lastIndexOf('/'))

      const ffmpeg = await Core.getSystemCommandPath('ffmpeg')

      try {
         await Promise.all(
            sizes.map(async (size) => {
               const localThmbFilePath = `${tmpFilePath}.thumb${size}.png`

               const ffmpegParams = [
                  '-i',
                  tmpFilePath,
                  '-vframes',
                  '1',
                  '-vf',
                  String.raw`select=gte(n\,0)`,
                  '-s',
                  `${size}x${Math.ceil(size * 0.7)}`,
                  '-ss',
                  '1',
                  localThmbFilePath,
                  '-y',
               ]
               await Core.execPromise(ffmpeg, ffmpegParams).then(async () => {
                  const thumbName = `thumb${size}`
                  const thumbPath = join(workingDir, thumbName) + `.png`

                  await sharp(localThmbFilePath)
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
            })
         )
      } catch (e) {
         Storage.error(e)
      }

      return thumbnails
   }

   async generateDocumentThumbnail(
      file: FileType,
      sizes: number[]
   ): Promise<any> {
      Storage.info(`Generating document thumbnail(s) for ${file.ref}`)

      const name = file.name || file.ref
      const thumbnails: any = {}
      const workingDir = join(tmpdir(), 'docthumbs')

      const extension = name.split('.').pop()?.toLowerCase()
      const tmpFilePath = join(workingDir, hash(name)) + `.${extension}`
      const thumbnailExtension = 'png'

      await fs.ensureDir(workingDir)

      try {
         await this.download(file, { path: tmpFilePath })
         const bucketDir = name.substring(0, name.lastIndexOf('/'))

         const convert = await Core.getSystemCommandPath('convert')

         await Promise.all(
            sizes.map(async (size) => {
               const thumbName = `thumb${size}`
               const thumbPath =
                  join(workingDir, thumbName) + `.${thumbnailExtension}`

               // Convert first page of document to image
               const convertParams = [
                  `${tmpFilePath}[0]`,
                  '-thumbnail',
                  `${size}x${size}`,
                  '-background',
                  'white',
                  '-alpha',
                  'remove',
                  '-density',
                  '150',
                  thumbPath,
               ]

               await Core.execPromise(convert, convertParams).then(async () => {
                  // Ensure the thumbnail is properly sized using Sharp
                  await sharp(thumbPath)
                     .resize(size, size, {
                        fit: 'contain',
                        background: { r: 255, g: 255, b: 255, alpha: 1 },
                     })
                     .png()
                     .toFile(thumbPath + '.final')

                  // Replace the original with the properly sized version
                  await fs.move(thumbPath + '.final', thumbPath, {
                     overwrite: true,
                  })

                  thumbnails[thumbName] =
                     join(bucketDir, thumbName) + `.${thumbnailExtension}`
                  Storage.debug(
                     `Generated ${size} document thumbnail for ${name}`
                  )

                  await this.create(
                     {
                        ...file,
                        ref:
                           join(bucketDir, thumbName) +
                           `.${thumbnailExtension}`,
                     },
                     createReadStream(thumbPath)
                  )
               })
            })
         )

         await fs.remove(workingDir)
      } catch (err) {
         Storage.error(
            `Document thumbnail generation for ${file.name} failed with error: ${err}`
         )
      }

      return thumbnails
   }

   async generateThumbnail(file: FileType, sizes: number[]): Promise<any> {
      const [type] = file.contentType
         ? file.contentType.split('/')
         : 'application/octet-stream'
      let thumbnails: any = {}

      // Get file extension for additional type checking
      const extension =
         file.name?.split('.').pop()?.toLowerCase() ||
         file.ref?.split('.').pop()?.toLowerCase()

      const documentExtensions = [
         'pdf',
         'doc',
         'docx',
         'ppt',
         'pptx',
         'xls',
         'xlsx',
         'odt',
         'odp',
         'ods',
         'rtf',
      ]

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
               // Handle various application types
               if (file.contentType?.includes('pdf') || extension === 'pdf') {
                  // PDF files
                  thumbnails = {
                     ...thumbnails,
                     ...(await this.generateDocumentThumbnail(file, sizes)),
                  }
               } else if (
                  file.contentType?.includes('msword') ||
                  file.contentType?.includes('wordprocessingml') ||
                  extension === 'doc' ||
                  extension === 'docx'
               ) {
                  // Word documents
                  thumbnails = {
                     ...thumbnails,
                     ...(await this.generateDocumentThumbnail(file, sizes)),
                  }
               } else if (
                  file.contentType?.includes('powerpoint') ||
                  file.contentType?.includes('presentationml') ||
                  extension === 'ppt' ||
                  extension === 'pptx'
               ) {
                  // PowerPoint presentations
                  thumbnails = {
                     ...thumbnails,
                     ...(await this.generateDocumentThumbnail(file, sizes)),
                  }
               } else if (
                  file.contentType?.includes('excel') ||
                  file.contentType?.includes('spreadsheetml') ||
                  extension === 'xls' ||
                  extension === 'xlsx'
               ) {
                  // Excel spreadsheets
                  thumbnails = {
                     ...thumbnails,
                     ...(await this.generateDocumentThumbnail(file, sizes)),
                  }
               } else if (documentExtensions.includes(extension || '')) {
                  // Other supported document types
                  thumbnails = {
                     ...thumbnails,
                     ...(await this.generateDocumentThumbnail(file, sizes)),
                  }
               } else if (extension === 'jpg') {
                  // Handle misidentified JPG files
                  console.log(`Processing possible missed image: ${file.ref}`)
                  thumbnails = {
                     ...thumbnails,
                     ...(await this.generateImageThumbnail(file, sizes)),
                  }
               } else {
                  console.log(
                     `Application type ${file.contentType} with extension ${extension} is not supported for thumbnailing`
                  )
               }
               break

            default:
               // Try document thumbnail generation for any file with supported extension
               if (documentExtensions.includes(extension || '')) {
                  console.log(
                     `Attempting document thumbnail for ${file.ref} based on extension`
                  )
                  thumbnails = {
                     ...thumbnails,
                     ...(await this.generateDocumentThumbnail(file, sizes)),
                  }
               } else {
                  console.log(
                     `${file.name} type (${file.contentType}) with extension (${extension}) can't be thumbnailed!`
                  )
               }
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
