import { Readable } from "stream"
import { FileType } from "./types/FileType"

/**
 * These are the public functions that any storage interface must expose
 */
export interface StorageAdapterInterface {
  create(file: FileType, stream: Readable,): Promise<FileType>
  delete(file: FileType): Promise<Boolean>,
  stream(file: FileType, res: any): Promise<any>,
  download(file: FileType, path: string): Promise<string>
  getUrl(file: FileType, expiresIn?: number, action?: string, extra?: any): Promise<any>,
  getUploadUrl(filePath: FileType, expiresIn?: number): Promise<any>
  getReadable(filePath: FileType): Promise<Readable>
  generateThumbnail(file: FileType, sizes: number[]): Promise<any>
  generateImageThumbnail(file: FileType, sizes: number[]): Promise<any>
  generateVideoThumbnail(file: FileType, sizes: number[]): Promise<any>
}
