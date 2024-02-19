import { ObjectUri } from './ObjectUri';
import { User } from './User';
export interface BaseObject {
    name: string;
    status: string;
    createdBy?: User | ObjectUri;
    createdAt?: number | string;
    updatedBy?: User | ObjectUri;
    updatedAt?: number | string;
    deletedBy?: User | ObjectUri;
    deletedAt?: number | string;
}
export declare const BaseObjectProperties: any;
