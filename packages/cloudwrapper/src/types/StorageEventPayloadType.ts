import { GenericEventPayloadType } from './GenericEventPayloadType'
import { FileType } from '@quatrain/storage'

export interface StorageEventPayloadType extends GenericEventPayloadType {
   before: FileType | undefined
   after: FileType | undefined
}
