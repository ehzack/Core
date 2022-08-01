import { Property } from '../..'
import { BaseProperty } from '../BaseProperty'

describe('Default Base Property', () => {
   const prop = new BaseProperty({ name: 'toto', type: Property.TYPE_ANY })
   test(`has a name`, () => expect(prop.name).toBe('toto'))
   test('is not mandatory by default', () => expect(prop.mandatory).toBe(false))
   test('is not protected by default', () => expect(prop.protected).toBe(false))
   test('allow all characters types by default', () =>
      expect(prop.allows).toHaveLength(0))
   test('val() before set returns undefined', () =>
      expect(prop.val()).toBeUndefined())
   test('set() returns this', () => expect(prop.set('any')).toBe(prop))
   test('val() after set returns value', () => expect(prop.val()).toBe('any'))
})

describe('Conf Base Property', () => {
   const prop = new BaseProperty({
      name: 'toto',
      type: Property.TYPE_ANY,
      mandatory: true,
      protected: true,
      defaultValue: 'nothing',
   })
   test('is mandatory', () => expect(prop.mandatory).toBe(true))
   test('is protected', () => expect(prop.protected).toBe(true))
   test('has default value', () => expect(prop.val()).toBe('nothing'))
})

describe('Advanced Base Property', () => {
   const prop = new BaseProperty({
      name: 'toto',
      type: Property.TYPE_ANY,
      mandatory: true,
      protected: true,
      defaultValue: 'nothing',
   })

   prop.set('a value')
   test('value can be defined', () => expect(prop.val()).toBe('a value'))
   test('but only once', () =>
      expect(() => {
         prop.set('another value')
      }).toThrow())
})
