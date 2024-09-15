import { Core } from './Core'
import * as statuses from './common/statuses'
import { Property } from './properties/Property'
import { BaseProperty, BasePropertyType } from './properties/BaseProperty'
import { StringProperty, StringPropertyType } from './properties/StringProperty'
import { EnumProperty, EnumPropertyType } from './properties/EnumProperty'
import {
   BooleanProperty,
   BooleanPropertyType,
} from './properties/BooleanProperty'
import {
   ObjectProperty,
   ObjectPropertyType,
   returnAs,
} from './properties/ObjectProperty'
import {
   DateTimeProperty,
   DateTimePropertyType,
} from './properties/DateTimeProperty'
import { HashProperty, HashPropertyType } from './properties/HashProperty'
import {
   CollectionProperty,
   CollectionPropertyType,
} from './properties/CollectionProperty'
import { ArrayProperty, ArrayPropertyType } from './properties/ArrayProperty'
import { AbstractObject } from './components/AbstractObject'
import { ObjectUri } from './components/ObjectUri'
import { DataObjectClass } from './components/types/DataObjectClass'
import { DataObject } from './components/DataObject'
import { BaseObjectCore } from './components/BaseObjectCore'
import { BaseObject, BaseObjectProperties } from './components/BaseObject'
import { Proxy } from './components/types/ProxyConstructor'

import { UserType, User, UserProperties } from './components/User'
import { EntityType, Entity } from './components/Entity'

import {
   BadRequestError,
   UnauthorizedError,
   ForbiddenError,
   NotFoundError,
   GoneError,
} from './common/ResourcesErrors'

export {
   statuses,
   Core,
   Property,
   BaseProperty,
   BasePropertyType,
   BooleanProperty,
   BooleanPropertyType,
   DateTimeProperty,
   DateTimePropertyType,
   EnumProperty,
   EnumPropertyType,
   HashProperty,
   HashPropertyType,
   CollectionProperty,
   CollectionPropertyType,
   ArrayProperty,
   ArrayPropertyType,
   ObjectProperty,
   ObjectPropertyType,
   returnAs,
   StringProperty,
   StringPropertyType,
   ObjectUri,
   DataObjectClass,
   DataObject,
   AbstractObject,
   BaseObject,
   BaseObjectCore,
   BaseObjectProperties,
   User,
   UserType,
   UserProperties,
   Proxy,
   Entity,
   EntityType,
   BadRequestError,
   UnauthorizedError,
   ForbiddenError,
   NotFoundError,
   GoneError,
}
