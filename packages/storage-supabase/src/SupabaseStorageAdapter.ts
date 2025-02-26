import {
   Storage,
   AbstractStorageAdapter,
   FileType,
   FileResponseUrlType,
   FileResponseLinkType,
   StorageParameters,
   DownloadFileMetaType,
} from '@quatrain/storage'
import { Readable, Stream } from 'stream'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { tmpdir } from 'os'
import { join } from 'path'

export class SupabaseStorageAdapter extends AbstractStorageAdapter {
   protected _client: SupabaseClient

   constructor(params: StorageParameters) {
      super(params)
      this._client = createClient(
         this._params.config.supabaseUrl,
         this._params.config.supabaseKey
      )
      Storage.log(`[ASA] Supabase Storage Adapter initialized`)
   }

   getDriver() {
      return this._client
   }

   getMetaData(file: FileType): Promise<FileType> {
      return new Promise(() => file)
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
      Storage.log(`Uploading ${file.ref} to ${file.bucket}`)

      const { data, error } = await this._client.storage
         .from(file.bucket)
         .upload(file.ref, await this.streamToBuffer(stream), {
            cacheControl: '3600',
            upsert: false,
         })

      return file
   }

   async copy(file: FileType, destFile: FileType) {
      Storage.log(
         `Copying file ${file.ref} to ${destFile.ref} in bucket ${file.bucket}`
      )
      try {
         const response = await this._client.storage
            .from(file.bucket)
            .copy(file.ref, destFile.ref, {
               destinationBucket: destFile.bucket,
            })
         console.log(response)
      } catch (err) {
         console.error(err)
      }
   }

   async move(file: FileType, destFile: FileType) {
      try {
         await this.copy(file, destFile)
         await this.delete(file)

         return destFile
      } catch (err) {
         return (err as Error).message
      }
   }

   async getUrl(file: FileType, expiresIn = 3600) {
      const { data, error } = await this._client.storage
         .from(file.bucket)
         .createSignedUrl(file.path, expiresIn)

      if (error !== null) {
         throw new Error(`Unable to get signed url: ${error}`)
      }

      return { url: data?.signedUrl, expiresIn }
   }

   async delete(file: FileType) {
      const { error } = await this._client.storage
         .from(file.bucket)
         .remove([file.ref])

      if (error !== null) {
         throw new Error(`Unable to delete ${file.ref}`)
      }

      Storage.log('Object successfully deleted')

      return true
   }

   async getReadable(file: FileType): Promise<Readable> {
      Storage.log(`GET Readable : ${file.ref}`)

      console.log(file)
      const path = join(tmpdir(), String(Date.now()))
      const item = await this.download(file, { path, onlyContent: true })
      const buffer = Buffer.from(item.toString(), 'base64')
      const readable = new Readable()
      readable.push(buffer)
      readable.push(null)

      return readable
   }

   async stream(file: FileType, res: any) {
      Storage.log(`GET Stream : ${file.ref}`)

      const path = join(tmpdir(), String(Date.now()))
      const item = await this.download(file, { path, onlyContent: true })
      const buffer = Buffer.from(item.toString(), 'base64')
      const readable = new Readable()
      readable.push(buffer)
      readable.push(null)

      return readable.pipe(res)
   }

   async download(
      file: FileType,
      meta: DownloadFileMetaType
   ): Promise<string | Blob> {
      const { data, error } = await this._client.storage
         .from(file.bucket)
         .download(meta.path)

      if (error !== null) {
         console.log(error)
         throw new Error(`Unable to download ${file.ref}`)
      }

      if (meta.onlyContent) {
         return data
      }
      return meta.path
   }

   async getUploadUrl(
      file: FileType,
      _expiresIn = 3600
   ): Promise<FileResponseLinkType> {
      const { data, error } = await this._client.storage
         .from(file.bucket)
         .createSignedUploadUrl(file.ref)

      if (error !== null) {
         throw new Error(`Unable to get signed upload url: ${error}`)
      }

      return {
         url: data?.signedUrl,
         method: 'PUT',
         accept: file.contentType || 'application/octet-stream',
         expiresIn: 7200, // fixed value in Supabase
      }
   }
}
