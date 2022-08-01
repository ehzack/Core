import { Core } from '../Core'

export class ObjectUri {
   static DEFAULT = '/'
   protected _literal: string = ''
   protected _backend: string = '@default'
   protected _path: string = ''
   protected _uid: string | undefined = undefined

   /**
    * create object uri from string:
    * ex: 'xyz', '@backend:xyz', 'collection/xyz', '@backend:collection/xyz'
    * some backends will need a collection or table name, some may deduct it from object
    * @param str
    */
   constructor(str: string = '') {
      const [backend, path] = str.split(':')
      if (path) {
         this._backend = backend
         this._path = path
      } else {
         this._backend = Core.defaultBackend
         this._path = backend
      }
      this._uid = this._path ? this._path.split('/').pop() : undefined
      this._literal = `${this._backend}:${this._path}`
   }

   get backend() {
      return this._backend
   }

   get path() {
      return this._path
   }

   get uid() {
      return this._uid
   }
}
