import { ObjectUri } from '../ObjectUri'

export type Persisted<T> = {
   uid: string
   uri: ObjectUri
} & T
