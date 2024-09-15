import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import {
   Storage,
   StorageParameters,
   AbstractStorageAdapter,
   DownloadFileMetaType,
   FileType,
   FileResponseUrlType,
   FileResponseLinkType,
} from '@quatrain/storage'
import { Readable } from 'stream'

export class FirebaseStorageAdapter extends AbstractStorageAdapter {
   constructor(params: StorageParameters = {}) {
      super(params)
      if (getApps().length === 0) {
         let credential = undefined
         if (this._params.config && this._params.config.credential) {
            const key = require(this._params.config.credential)
            credential = cert(key)
         }
         Storage.log(`[FBSA] Firebase Storage Adapter initialized`)
         initializeApp({ credential })
      }
   }

   getDriver() {
      return getStorage()
   }

   async download(file: FileType, meta: DownloadFileMetaType) {
      const bucket = getStorage().bucket(file.bucket)
      if (meta.onlyContent) {
         return (await bucket.file(file.ref).download())[0]
      }
      await bucket.file(file.ref).download({ destination: meta.path })

      return meta.path
   }

   async copy(file: FileType, destFile: FileType) {
      getStorage()
         .bucket(file.bucket)
         .file(file.ref)
         .copy(getStorage().bucket(destFile.bucket).file(destFile.ref))
   }

   async move(file: FileType, destFile: FileType) {
      getStorage()
         .bucket(file.bucket)
         .file(file.ref)
         .move(getStorage().bucket(destFile.bucket).file(destFile.ref))
   }

   async create(File: FileType, stream: Readable): Promise<FileType> {
      const file = getStorage().bucket(File.bucket).file(File.ref)
      const writeStream = file.createWriteStream({})
      const pipelineFinished = await new Promise((resolve, reject) => {
         stream
            .pipe(writeStream)
            .on('error', (error: unknown) => {
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
   ): Promise<FileResponseUrlType> {
      var expires = new Date()
      expires.setSeconds(expires.getSeconds() + expiresIn)

      const [file] = await getStorage()
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
      Storage.log(`${bucket} Removing linked file '${ref}' in `)

      try {
         await getStorage().bucket(bucket).file(ref).delete()
         return true
      } catch (err) {
         Storage.log(
            ` Error while removing linked file '${ref}': ${
               (err as Error).message
            }`
         )
      }
      return false
   }

   async stream(file: FileType, res: any) {
      const bucket = getStorage().bucket()
      return bucket.file(file.ref).createReadStream().pipe(res)
   }

   async getUploadUrl(
      file: FileType,
      duration: number = 3600
   ): Promise<FileResponseLinkType> {
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
      Storage.log('[GSA] Get readable of file', file.ref)
      const fileRef = getStorage().bucket(file.bucket).file(file.ref)
      const [exists] = await fileRef.exists()

      if (!exists) {
         throw new Error(`The file ${file.ref} does not exist!`)
      }
      const fileStream = fileRef.createReadStream()
      let fileContents = Buffer.from('')
      const pipelineFinished = await new Promise((resolve, reject) => {
         fileStream.on('data', (chunk: any) => {
            fileContents = Buffer.concat([fileContents, chunk])
            Storage.log(`Received chunk with ${chunk.length} bytes`)
         })
         fileStream.on('error', (error: any) => {
            Storage.log('Error reading file stream:', error)
         })
         fileStream.on('end', () => {
            Storage.log('File stream ended.')

            resolve('File stream ended.')
         })
      })
      await pipelineFinished

      console.log('Readable Length:', fileContents.length)
      const FileReadable = Readable.from(fileContents)
      console.log('FileReadable length :', FileReadable.readableLength)
      return FileReadable
   }
}
