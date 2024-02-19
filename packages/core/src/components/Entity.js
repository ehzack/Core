"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = exports.EntityProperties = void 0;
const BaseObjectCore_1 = require("./BaseObjectCore");
const BaseObject_1 = require("./BaseObject");
const User_1 = require("./User");
const CollectionProperty_1 = require("../properties/CollectionProperty");
const StringProperty_1 = require("../properties/StringProperty");
const htmlType = __importStar(require("../properties/types/PropertyHTMLType"));
exports.EntityProperties = [
    {
        // surcharge property minLength and htmlType
        name: 'name',
        type: StringProperty_1.StringProperty.TYPE,
        mandatory: true,
        minLength: 1,
        htmlType: htmlType.ORG,
    },
    {
        name: 'users',
        mandatory: true,
        type: CollectionProperty_1.CollectionProperty.TYPE,
        instanceOf: 'User',
        parentKey: 'entity',
    },
];
class Entity extends BaseObjectCore_1.BaseObjectCore {
}
exports.Entity = Entity;
Entity.COLLECTION = 'entities';
Entity.PROPS_DEFINITION = [
    ...BaseObject_1.BaseObjectProperties,
    {
        // surcharge property minLength and htmlType
        name: 'name',
        type: StringProperty_1.StringProperty.TYPE,
        mandatory: true,
        minLength: 1,
        htmlType: htmlType.ORG,
    },
    {
        name: 'users',
        mandatory: true,
        type: CollectionProperty_1.CollectionProperty.TYPE,
        instanceOf: User_1.User,
        parentKey: 'entity',
    },
];
