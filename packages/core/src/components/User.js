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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserProperties = void 0;
const BaseObjectCore_1 = require("./BaseObjectCore");
const properties_1 = require("../properties");
const HashProperty_1 = require("../properties/HashProperty");
const StringProperty_1 = require("../properties/StringProperty");
const htmlType = __importStar(require("../properties/types/PropertyHTMLType"));
const BaseObject_1 = require("./BaseObject");
const Entity_1 = require("./Entity");
/**
 * Callback function to populate the 'name' property
 * @param dao DataObject
 * @returns
 */
const onChange = (dao) => dao.set('name', `${dao.val('firstname')} ${dao.val('lastname')}`);
exports.UserProperties = [
    ...BaseObject_1.BaseObjectProperties,
    {
        // change name property minLength
        name: 'name',
        type: StringProperty_1.StringProperty.TYPE,
        minLength: 0,
        htmlType: htmlType.NAME,
    },
    {
        name: 'firstname',
        mandatory: true,
        type: StringProperty_1.StringProperty.TYPE,
        minLength: 1,
        maxLength: 100,
        fullSearch: true,
        htmlType: htmlType.GIVEN_NAME,
        onChange,
    },
    {
        name: 'lastname',
        mandatory: true,
        type: StringProperty_1.StringProperty.TYPE,
        minLength: 1,
        maxLength: 100,
        fullSearch: true,
        htmlType: htmlType.FAMILY_NAME,
        onChange,
    },
    {
        name: 'gender',
        mandatory: false,
        type: properties_1.EnumProperty.TYPE,
        values: ['male', 'female', 'nonbinary'],
        htmlType: htmlType.GENDER,
    },
    {
        name: 'birthday',
        mandatory: false,
        type: properties_1.DateTimeProperty.TYPE,
        htmlType: htmlType.BIRTHDAY,
    },
    {
        name: 'email',
        mandatory: true,
        type: StringProperty_1.StringProperty.TYPE,
        minLength: 1,
        maxLength: 100,
        fullSearch: true,
        htmlType: htmlType.EMAIL,
    },
    {
        name: 'phone',
        type: StringProperty_1.StringProperty.TYPE,
        minLength: 1,
        maxLength: 100,
        htmlType: htmlType.OFF,
    },
    {
        name: 'password',
        mandatory: true,
        type: HashProperty_1.HashProperty.TYPE,
        algorithm: HashProperty_1.HashProperty.ALGORITHM_SHA256,
        salt: '', // you should override it in your code
        minLength: 5,
        maxLength: 20, // this is for the clear password
        htmlType: htmlType.PASSWORD,
    },
    {
        name: 'entity',
        mandatory: false,
        type: properties_1.ObjectProperty.TYPE,
        instanceOf: Entity_1.Entity,
    },
];
class User extends BaseObjectCore_1.BaseObjectCore {
    static factory(src = undefined) {
        const _super = Object.create(null, {
            factory: { get: () => super.factory }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.factory.call(this, src, User);
        });
    }
}
exports.User = User;
User.PROPS_DEFINITION = exports.UserProperties;
User.COLLECTION = 'user';
