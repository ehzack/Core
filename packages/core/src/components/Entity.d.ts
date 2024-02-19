import { BaseObjectCore } from './BaseObjectCore';
import { BaseObject } from './BaseObject';
import { User } from './User';
import { EntityClass } from './types/EntityClass';
export declare const EntityProperties: any;
export interface EntityType extends BaseObject {
    users?: User[];
}
export declare class Entity extends BaseObjectCore implements EntityClass {
    static COLLECTION: string;
    static PROPS_DEFINITION: any[];
}
