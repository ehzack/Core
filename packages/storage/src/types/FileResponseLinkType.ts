export type FileResponseLinkType = {
  url: string
  method: 'PUT' | 'POST' | 'GET'
  accept: string
  size?: number
  expiresIn?: number
}
