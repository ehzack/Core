import { Readable } from 'stream'
import { FileType } from './types/FileType'
import { StorageAdapterInterface } from './StorageAdapterInterface'
import { DownloadFileMeta } from './types/DownloadFileMetaType'
import { StorageParameters } from '../Storage'
//import { APIResponseLink, ResponsePublicUrl } from './types'

export abstract class AbstractStorageAdapter
   implements StorageAdapterInterface
{
   protected _alias: string = ''
   protected _params: StorageParameters = {}

   constructor(params: StorageParameters = {}) {
      this._alias = params.alias || ''
      this._params = params
   }

   abstract getDriver(): any

   abstract create(file: FileType, stream: Readable): Promise<FileType>

   abstract download(file: FileType, path: DownloadFileMeta): Promise<any>

   abstract copy(file: FileType, destFile: FileType): Promise<any>

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

   abstract generateThumbnail(file: FileType, sizes: number[]): Promise<any>

   abstract generateImageThumbnail(
      file: FileType,
      sizes: number[]
   ): Promise<any>

   abstract generateVideoThumbnail(
      file: FileType,
      sizes: number[]
   ): Promise<any>
}
