import { BaseObjectCore } from './BaseObjectCore';
import { BaseObject } from './BaseObject';
export interface UserType extends BaseObject {
    name: string;
    firstname: string;
    lastname: string;
    gender?: 'male' | 'female' | 'nonbinary';
    birthday?: Date;
    password: string;
    email: string;
}
export declare const UserProperties: any;
export declare class User extends BaseObjectCore {
    static PROPS_DEFINITION: any;
    static COLLECTION: string;
    static factory(src?: any): Promise<User>;
}
