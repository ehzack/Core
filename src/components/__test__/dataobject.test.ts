import { properties, fClass, fData } from './fixtures/dao'
import { DataObject } from '../DataObject'
import { MockAdapter } from '../../backends/MockAdapter'
import { ObjectUri } from '../ObjectUri'
import { Core } from '../../Core'

MockAdapter.inject(fData)
Core.addBackend(new MockAdapter(), '@mock', true)

const params = { properties }

describe('Data object', () => {
   test('has properties that are instances', () => {
      const dao = DataObject.factory(params)
      expect(dao.get('string').constructor.name).toBe('StringProperty')
      expect(dao.get('boolean').constructor.name).toBe('BooleanProperty')
      expect(dao.get('enum').constructor.name).toBe('EnumProperty')
      expect(dao.get('object').constructor.name).toBe('ObjectProperty')
   })

   test('has a class name', () => {
      const dao = DataObject.factory(params)
      expect(dao.class).toBeUndefined()
      dao.uri.class = fClass
      expect(dao.class).toBe(fClass)
   })

   test('can set its uri from a string or an ObjectUri', () => {
      const dao = DataObject.factory({ uri: 'a/b', ...params })
      expect(dao.uri.constructor.name).toBe('ObjectUri')
      dao.uri = new ObjectUri('a/b')
      expect(dao.uri.constructor.name).toBe('ObjectUri')
   })

   test('can provide default values of props', () => {
      const dao = DataObject.factory(params)
      expect(dao.val('string')).toEqual('nothing')
      expect(dao.val('boolean')).toEqual(false)
      expect(dao.val('enum')).toEqual(undefined)
      expect(dao.val('object')).toEqual(undefined)
   })

   test('can be populated with data', () => {
      const dao = DataObject.factory({ uri: 'a/b', ...params })
      dao.read().then(() => {
         expect(dao.isPopulated()).toBe(true)
         expect(dao.val('string')).toEqual('a string')
         expect(dao.val('boolean')).toEqual(true)
         expect(dao.val('enum')).toEqual('Miss')
         expect(dao.val('object').constructor.name).toEqual('ObjectUri')
      })
   })

   test('can be cloned', () => {
      const dao = DataObject.factory(params)
      dao.clone().then((clone) => {
         expect(clone.class).toBe(dao.class)
         expect(clone.properties.length).toBe(dao.properties.length)
         expect(clone.properties.string).toBeDefined()
         expect(clone.properties.boolean).toBeDefined()
         expect(clone.properties.enum).toBeDefined()
         expect(clone.properties.object).toBeDefined()
      })
   })
})
