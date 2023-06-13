import { describe, test, expect, beforeAll } from '@jest/globals'
import UserRepository from '../UserRepository'
import { MockAdapter, Query } from '../../backends'
import { UserData, UserUri } from './fixtures/dao'
import { Core } from '../../Core'
import {
   GoneError,
   NotFoundError,
   UnauthorizedError,
} from '../../common/ResourcesErrors'
import { User } from '../User'
import { statuses } from '../..'

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
      User.factory(UserData).then((fUser) => {
         userRepository
            .create(fUser, UserData.uid)
            .then((createdBradObject) => {
               expect(createdBradObject).toEqual(fUser)

               if (!createdBradObject.uid) {
                  throw new Error()
               }

               backendAdapter
                  .read(createdBradObject.dataObject)
                  .then((readBradObject) => {
                     expect(readBradObject).toEqual(
                        createdBradObject.dataObject
                     )

                     expect(readBradObject.val('name')).toEqual(fUser.name)
                  })
            })
      })
   })

   test('readFromUid method should return a User', async () => {
      userRepository.read(UserData.uid).then((readBradObject) => {
         expect(readBradObject).toBeInstanceOf(User)
         expect(readBradObject.name).toBe(UserData.name)
      })
   })

   test('readFromUid should throw NotFoundError', async () => {
      const t = async () => {
         await userRepository.read('hello')
      }

      expect(t()).rejects.toThrow(NotFoundError)
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

   test('hardDelete should remove the object from the backend', async () => {
      userRepository
         .hardDelete('deleted')
         .then(() =>
            expect(MockAdapter.getFixture('user/deleted')).toEqual(undefined)
         )
   })

   test('query should work as expected', async () => {
      const query: Query<typeof User> = User.query() as Query<typeof User>

      userRepository.query(query).then(({ items, meta }) => {
         const numberOfObjects = 2

         expect(meta.count).toEqual(numberOfObjects)
      })
   })
})

describe('UserRepository specific methods', () => {
   test('getUserByEmail should return a user', async () => {
      userRepository.getFromEmail(UserData.email).then((user) => {
         expect(user.val('email')).toBe(UserData.email)
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
