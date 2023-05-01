import { ObjectUri } from '../../../components'
import { MockAdapter } from '../../MockAdapter'
import { faker } from '@faker-js/faker'

export const UserDataGenerator = (
   qty: number = 5,
   entity: ObjectUri | string | null = null,
   debug = false
): string[] => {
   const uids: string[] = []
   for (let i = 0; i < qty; i++) {
      const uid = faker.random.alphaNumeric(12)
      uids.push(uid)
      const user = {
         uid,
         path: `users/${uid}`,
         firstname: faker.name.firstName(),
         lastname: faker.name.lastName(),
         email: faker.internet.email(),
         password: faker.random.alphaNumeric(16),
         entity: entity instanceof ObjectUri ? entity.toReference() : entity,
      }
      MockAdapter.inject(user)
      if (debug) {
         console.log(`generated user ${i + 1}`, user)
      }
   }

   if (debug) {
      console.log(`Content of MockAdapter fixtures`, MockAdapter.getFixtures())
   }

   return uids
}
