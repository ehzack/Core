export interface FileType {
  bucket: string
  ref: string
  label?: string
  contentType?: string
  size?: number
  framerate?: number
  duration?: number
  bitrate?: number
  width?: number
  height?: number
  thumb128?: string
  thumb256?: string
  [x: string]: any
}
