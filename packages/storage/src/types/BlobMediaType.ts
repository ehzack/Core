import { BlobType } from "./BlobType"

export interface BlobMediaType extends BlobType {
  width?: number
  height?: number
  bitrate?: number
  thumb128?: string
  thumb256?: string
}
