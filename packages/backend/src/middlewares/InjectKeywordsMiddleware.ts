import { DataObjectClass, ArrayProperty } from '@quatrain/core'
import { BackendAction } from '../Backend'
import BackendMiddleware from './Middleware'

export interface InjectKeywordsMiddlewareParams {}

/**
 * Backend middleware that automatically generates searchable keywords for an object.
 * It scans all string properties marked with `fullSearch: true` and generates substrings
 * to enable fast type-ahead searches on platforms like Firestore.
 */
export class InjectKeywordsMiddleware implements BackendMiddleware {
   /**
    * Hooks into the backend execution pipeline before CREATE or UPDATE actions.
    * Computes and injects an array of substrings into the `keywords` property.
    * 
    * @param dataObject - The payload traversing the backend.
    * @param action - The requested database action.
    */
   beforeExecute(dataObject: DataObjectClass<any>, action: BackendAction) {
      if (!dataObject.has('keywords')) {
         dataObject.addProperty(new ArrayProperty({ name: 'keywords' }))
      }
      switch (action) {
         case BackendAction.CREATE:
         case BackendAction.UPDATE:
            dataObject.set('keywords', this._createKeywords(dataObject))
            break
         default:
            break
      }

      return
   }

   protected _createKeywords(dataObject: DataObjectClass<any>): string[] {
      const keywords: string[] = []
      Object.keys(dataObject.properties)
         .filter((key: string) => dataObject.get(key).fullSearch === true)
         .forEach((key: string) => {
            const val = dataObject.val(key)
            if (val) {
               val.toLowerCase()
                  .split(' ')
                  .forEach((word: string) => {
                     let seq: string = ''
                     word
                        .split('')
                        .splice(0, 15)
                        .forEach((letter) => {
                           seq += letter
                           if (seq.length > 1) {
                              keywords.push(seq)
                           }
                        })
                  })
            }
         })

      return [...new Set(keywords)]
   }
}
