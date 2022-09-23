import { Core } from '../Core'

export class ObjectUri {
   static DEFAULT = '/'
   protected _literal: string = ''
   protected _backend: string = '@default'
   protected _path: string = '/'
   protected _uid: string | undefined = undefined
   protected _collection: string | undefined = undefined
   protected _label: string | undefined

   /**
    * create object uri from string:
    * ex: 'xyz', '@backend:xyz', 'collection/xyz', '@backend:collection/xyz'
    * some backends will need a collection or table name, some may deduct it from object
    * @param str
    */
   constructor(str: string = '', label: string | undefined = undefined) {
      const [backend, path] = str.split(':')
      if (path) {
         this._backend = backend || Core.defaultBackend
         this._path = path || backend
         this._collection = path.split('/').pop()
      }
      this._uid = this._path ? this._path.split('/').pop() : undefined
      this._literal = `${this._backend}:${this._path}`
      this._label = label || this._uid
   }

   get backend() {
      return this._backend
   }

   get path() {
      return this._path
   }

   set label(label: string | undefined) {
      this._label = label
   }

   get label() {
      return this._label
   }

   set path(path: string) {
      if (this._path !== '/') {
         throw new Error('Path value already set')
      }
      this._path = path
      this._collection = path.split('/').pop()
      this._literal = `${this._backend}:${this._path}`
   }

   get uid() {
      return this._uid
   }

   get collection(): string | undefined {
      return this._collection
   }

   set collection(collection: string | undefined) {
      if (this.collection !== undefined) {
         throw new Error('Collection value already set')
      }
      this._collection = collection
   }

   /**
    * Return references to find object locally and remotely
    * @returns object
    */
   toReference() {
      return {
         ref: this._path,
         uri: this._literal,
         label: this._label,
      }
   }

   toJSON() {
      return {
         literal: this._literal,
         ref: this._path,
         label: this._label,
      }
   }
}
