import { User } from '@quatrain/backend'
import { Filter, OperatorKeys } from '@quatrain/backend'
import { setup, createUser, createEntity, Entity } from './common'

describe('SQLite Search Operations', () => {
   let adapter: any
   let user: User
   let entity: Entity

   beforeAll(async () => {
      adapter = setup()

      // Create test entity
      entity = await createEntity()
      await adapter.create(entity.dataObject, undefined)

      // Create multiple test users
      const users = []
      for (let i = 0; i < 10; i++) {
         const testUser = await User.factory()
         testUser._.firstname = `TestUser${i}`
         testUser._.lastname = i % 2 === 0 ? 'Even' : 'Odd'
         testUser._.email = `testuser${i}@example.com`
         testUser._.password = 'password'
         
         // Some users belong to the entity
         if (i < 5) {
            testUser._.entity = entity
         }
         
         await adapter.create(testUser.dataObject, undefined)
         users.push(testUser)
      }

      user = users[0]
   })

   afterAll(async () => {
      await adapter.deleteCollection('user')
      await adapter.deleteCollection('entities')
      await adapter.close()
   })

   describe('Basic Search Operations', () => {
      test('find all users without filters', async () => {
         const searchUser = await User.factory()
         const result = await adapter.find(searchUser.dataObject)
         
         expect(result.items.length).toBe(10)
         expect(result.meta.count).toBe(10)
         expect(result.meta.batch).toBe(20) // Default batch size
         expect(result.meta.offset).toBe(0)
      })

      test('find users with firstname filter', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('firstname', 'TestUser5', OperatorKeys.equals)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBe(1)
         expect(result.items[0].val('firstname')).toBe('TestUser5')
      })

      test('find users with lastname filter', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('lastname', 'Even', OperatorKeys.equals)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBe(5)
         
         result.items.forEach((item: any) => {
            expect(item.val('lastname')).toBe('Even')
         })
      })

      test('find users with multiple filters', async () => {
         const searchUser = await User.factory()
         const filters = [
            new Filter('lastname', 'Even', OperatorKeys.equals),
            new Filter('firstname', 'TestUser0', OperatorKeys.equals)
         ]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBe(1)
         expect(result.items[0].val('firstname')).toBe('TestUser0')
         expect(result.items[0].val('lastname')).toBe('Even')
      })
   })

   describe('Comparison Operators', () => {
      test('greater than filter', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('firstname', 'TestUser5', OperatorKeys.greater)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBeGreaterThan(0)
         
         result.items.forEach((item: any) => {
            expect(item.val('firstname') > 'TestUser5').toBe(true)
         })
      })

      test('less than filter', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('firstname', 'TestUser5', OperatorKeys.lower)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBeGreaterThan(0)
         
         result.items.forEach((item: any) => {
            expect(item.val('firstname') < 'TestUser5').toBe(true)
         })
      })

      test('not equals filter', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('lastname', 'Even', OperatorKeys.notEquals)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBe(5)
         
         result.items.forEach((item: any) => {
            expect(item.val('lastname')).not.toBe('Even')
         })
      })

      test('greater than or equals filter', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('firstname', 'TestUser5', OperatorKeys.greaterOrEquals)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBeGreaterThan(0)
         
         result.items.forEach((item: any) => {
            expect(item.val('firstname') >= 'TestUser5').toBe(true)
         })
      })

      test('less than or equals filter', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('firstname', 'TestUser5', OperatorKeys.lowerOrEquals)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBeGreaterThan(0)
         
         result.items.forEach((item: any) => {
            expect(item.val('firstname') <= 'TestUser5').toBe(true)
         })
      })
   })

   describe('Text Search Operations', () => {
      test('keywords search across multiple fields', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('keywords', 'TestUser', OperatorKeys.like)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBe(10) // All users have "TestUser" in firstname
      })

      test('keywords search with specific term', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('keywords', 'testuser3@example.com', OperatorKeys.like)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBeGreaterThan(0)
      })

      test('like filter on specific field', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('email', '@example.com', OperatorKeys.like)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBe(10) // All test users have @example.com
      })
   })

   describe('Pagination and Sorting', () => {
      test('pagination with limit', async () => {
         const searchUser = await User.factory()
         const pagination = {
            limits: { batch: 3, offset: 0 },
            sortings: [{ prop: 'firstname', order: 'asc' as const }]
         }
         
         const result = await adapter.find(searchUser.dataObject, undefined, pagination)
         expect(result.items.length).toBe(3)
         expect(result.meta.batch).toBe(3)
         expect(result.meta.offset).toBe(0)
         expect(result.meta.count).toBe(10) // Total count should still be 10
      })

      test('pagination with offset', async () => {
         const searchUser = await User.factory()
         const pagination = {
            limits: { batch: 3, offset: 3 },
            sortings: [{ prop: 'firstname', order: 'asc' as const }]
         }
         
         const result = await adapter.find(searchUser.dataObject, undefined, pagination)
         expect(result.items.length).toBe(3)
         expect(result.meta.offset).toBe(3)
      })

      test('sorting ascending', async () => {
         const searchUser = await User.factory()
         const pagination = {
            limits: { batch: 5, offset: 0 },
            sortings: [{ prop: 'firstname', order: 'asc' as const }]
         }
         
         const result = await adapter.find(searchUser.dataObject, undefined, pagination)
         
         for (let i = 1; i < result.items.length; i++) {
            const prev = result.items[i-1].val('firstname')
            const curr = result.items[i].val('firstname')
            expect(prev <= curr).toBe(true)
         }
      })

      test('sorting descending', async () => {
         const searchUser = await User.factory()
         const pagination = {
            limits: { batch: 5, offset: 0 },
            sortings: [{ prop: 'firstname', order: 'desc' as const }]
         }
         
         const result = await adapter.find(searchUser.dataObject, undefined, pagination)
         
         for (let i = 1; i < result.items.length; i++) {
            const prev = result.items[i-1].val('firstname')
            const curr = result.items[i].val('firstname')
            expect(prev >= curr).toBe(true)
         }
      })

      test('multiple sorting criteria', async () => {
         const searchUser = await User.factory()
         const pagination = {
            limits: { batch: 10, offset: 0 },
            sortings: [
               { prop: 'lastname', order: 'asc' as const },
               { prop: 'firstname', order: 'desc' as const }
            ]
         }
         
         const result = await adapter.find(searchUser.dataObject, undefined, pagination)
         expect(result.items.length).toBe(10)
         expect(result.meta.sortField).toContain('lastname ASC')
         expect(result.meta.sortField).toContain('firstname DESC')
      })
   })

   describe('Object Reference Filters', () => {
      test('filter by entity reference', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('entity', entity, OperatorKeys.equals)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBe(5) // 5 users have this entity
         
         result.items.forEach((item: any) => {
            const entityValue = item.val('entity')
            expect(entityValue).toBeDefined()
         })
      })

      test('filter by null entity', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('entity', 'null', OperatorKeys.equals)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBe(5) // 5 users don't have entity
      })
   })

   describe('Complex Queries', () => {
      test('combined filters with pagination and sorting', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('lastname', 'Even', OperatorKeys.equals)]
         const pagination = {
            limits: { batch: 2, offset: 1 },
            sortings: [{ prop: 'firstname', order: 'asc' as const }]
         }
         
         const result = await adapter.find(searchUser.dataObject, filters, pagination)
         expect(result.items.length).toBe(2)
         expect(result.meta.count).toBe(5) // Total matching records
         expect(result.meta.offset).toBe(1)
         
         result.items.forEach((item: any) => {
            expect(item.val('lastname')).toBe('Even')
         })
      })

      test('no results query', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('firstname', 'NonExistentUser', OperatorKeys.equals)]
         
         const result = await adapter.find(searchUser.dataObject, filters)
         expect(result.items.length).toBe(0)
         expect(result.meta.count).toBe(0)
      })
   })

   describe('Error Cases', () => {
      test('invalid property name in filter', async () => {
         const searchUser = await User.factory()
         const filters = [new Filter('invalidProperty', 'value', OperatorKeys.equals)]
         
         await expect(adapter.find(searchUser.dataObject, filters)).rejects.toThrow()
      })

      test('invalid collection for search', async () => {
         const searchUser = await User.factory()
         // Force collection to be undefined
         Object.defineProperty(searchUser.dataObject.uri, 'collection', {
            value: undefined,
            writable: true
         })
         
         await expect(adapter.find(searchUser.dataObject)).rejects.toThrow()
      })
   })
})