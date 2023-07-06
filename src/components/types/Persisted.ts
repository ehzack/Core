import { ObjectUri } from '../ObjectUri'
import { Proxy } from './ProxyConstructor'

export type Persisted<T> = {
   uid: string
   uri: ObjectUri
} & Proxy<T>
