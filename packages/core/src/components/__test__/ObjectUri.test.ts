import { ObjectUri } from '../ObjectUri'

describe('Object Uri', () => {
   test('relative uri', () => {
      const uri = new ObjectUri('collection/uid', 'a label')
      expect(uri.backend).toBe('@default')
      expect(uri.path).toBe('collection/uid')
      expect(uri.literal).toBe('@default:collection/uid')
      expect(uri.collection).toBe('collection')
      expect(uri.uid).toBe('uid')
      expect(uri.label).toBe('a label')
   })

   test('relative uri with sub collection', () => {
      const uri = new ObjectUri('collection/uid/subcollection/sid', 'a label')
      expect(uri.backend).toBe('@default')
      expect(uri.path).toBe('collection/uid/subcollection/sid')
      expect(uri.literal).toBe('@default:collection/uid/subcollection/sid')
      expect(uri.collection).toBe('subcollection')
      expect(uri.uid).toBe('sid')
      expect(uri.label).toBe('a label')
   })

   test('uri with backend', () => {
      const uri = new ObjectUri('@backend:collection/uid', 'a label')
      expect(uri.backend).toBe('@backend')
      expect(uri.path).toBe('collection/uid')
      expect(uri.literal).toBe('@backend:collection/uid')
      expect(uri.collection).toBe('collection')
      expect(uri.uid).toBe('uid')
      expect(uri.label).toBe('a label')
   })

   test('uri points to file', () => {
      const uri = new ObjectUri('collection/uid/file.ext', 'a file')
      expect(uri.path).toBe('collection/uid')
      expect(uri.literal).toBe('collection/uid/file.ext')
      expect(uri.collection).toBe('collection')
      expect(uri.uid).toBe('file.ext')
      expect(uri.label).toBe('a file')
   })

   test('uri without collection', () => {
      const uri = new ObjectUri('uid')
      expect(uri.backend).toBe('@default')
      expect(uri.path).toBe('uid')
      expect(uri.literal).toBe(`@default:${ObjectUri.MISSING_COLLECTION}/uid`)
      expect(uri.collection).toBeUndefined()
      expect(uri.uid).toBe('uid')

      uri.collection = 'collection'
      expect(uri.collection).toBe('collection')
   })
})
