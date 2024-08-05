export type FileResponseLink = {
  href: string
  type: 'PUT' | 'POST' | 'GET'
  accept: string
  size?: number
  expiresIn?: number
}
