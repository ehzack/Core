import { FileType } from './FileType'

export interface BlobType extends FileType {
   size: number
   contentType: string
   isTempFile?: boolean
}
