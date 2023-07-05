import { describe, test, expect } from '@jest/globals'
import UserRepository from '../UserRepository'
import { MockAdapter, Query } from '../../backends'
import { UserData, UserUri } from './fixtures/dao'
import { Core } from '../../Core'
import { GoneError, NotFoundError } from '../../common/ResourcesErrors'
import { User, UserCore } from '../User'
import * as statuses from '../../statuses'

MockAdapter.inject(UserData)
MockAdapter.inject({
   ...UserData,
   path: 'user/deleted',
   uid: 'deleted',
   name: 'Jane Ive',
   status: statuses.DELETED,
})
Core.addBackend(new MockAdapter(), '@mock', true)

const backendAdapter = Core.getBackend('@mock')
const userRepository = new UserRepository(backendAdapter)

describe('repository instantiation tests', () => {
   test('should instantiate properly', () => {
      const userRepository = new UserRepository(backendAdapter)

      expect(userRepository.backendAdapter).toEqual(backendAdapter)
   })
})

describe('CRUD methods tests', () => {
   test('create method should save in collection', async () => {
      const fUser: User = UserCore.fromObject(UserData)

      userRepository.create(fUser, UserData.uid).then((createdBradObject) => {
         if (!createdBradObject.core.uid) {
            throw new Error()
         }

         backendAdapter
            .read(createdBradObject.core.dataObject)
            .then((readBradObject) => {
               expect(readBradObject).toEqual(createdBradObject.core.dataObject)

               expect(readBradObject.val('name')).toEqual(fUser.name)
            })
      })
   })

   test('read method should return a User', async () => {
      userRepository.read(UserData.uid).then((readBradObject) => {
         //expect(readBradObject).toBeInstanceOf(User)
         expect(readBradObject.core.val('name')).toEqual(UserData.name)
      })
   })

   test('readFromUid should throw NotFoundError', async () => {
      const t = async () => {
         await userRepository.read('hello')
      }

      expect(t).rejects.toThrow(NotFoundError)
   })

   test('readFromUid should throw GoneError', async () => {
      const t = async () => {
         await userRepository.read('deleted')
      }

      expect(t).rejects.toThrow(GoneError)
   })

   test('update should change the object in the backend', async () => {
      const newName = 'New name'

      userRepository.read(UserData.uid).then((readBradObject) => {
         readBradObject.name = newName

         userRepository.update(readBradObject).then(() => {
            expect(MockAdapter.getFixture(UserUri).name).toBe(newName)
         })
      })
   })

   test('delete should remove the object from the backend', async () => {
      userRepository
         .delete('deleted')
         .then(() =>
            expect(MockAdapter.getFixture('user/deleted')).toEqual(undefined)
         )
   })

   test('query should work as expected', async () => {
      const query: Query<typeof UserCore> = UserCore.query() as Query<
         typeof UserCore
      >

      userRepository.query(query).then(({ items, meta }) => {
         const numberOfObjects = 2

         expect(meta.count).toEqual(numberOfObjects)
      })
   })
})

describe('UserRepository specific methods', () => {
   test('getUserByEmail should return a user', async () => {
      //expect.assertions(1)
      userRepository.getFromEmail(UserData.email).then((user: User) => {
         expect(user.email).toBe(UserData.email)
      })
   })

   test('getUserByEmail should throw NotFoundError', () => {
      const t = async () => userRepository.getFromEmail('idontexist@acme.com')

      expect(t).rejects.toThrow(NotFoundError)
   })

   //    test('login should return a user', () => {
   //       userRepository.login(UserData.email, UserData.password).then((user) => {
   //          expect(user.val('email')).toBe(UserData.email)
   //          expect(user.val('password')).toBe(UserData.password)
   //       })
   //    })

   //    test('login should throw UnauthorizedError', () => {
   //       const t = async () =>
   //          userRepository.login(UserData.email, 'wrongpassword')

   //       expect(t).rejects.toThrow(UnauthorizedError)
   //    })
})
