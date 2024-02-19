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
exports.BaseObjectProperties = void 0;
const statuses = __importStar(require("../statuses"));
const StringProperty_1 = require("../properties/StringProperty");
const ObjectProperty_1 = require("../properties/ObjectProperty");
const EnumProperty_1 = require("../properties/EnumProperty");
const DateTimeProperty_1 = require("../properties/DateTimeProperty");
const htmlType = __importStar(require("../properties/types/PropertyHTMLType"));
exports.BaseObjectProperties = [
    {
        name: 'name',
        mandatory: true,
        type: StringProperty_1.StringProperty.TYPE,
        minLength: 1,
        maxLength: 100,
        htmlType: htmlType.NAME,
    },
    {
        name: 'status',
        mandatory: true,
        type: EnumProperty_1.EnumProperty.TYPE,
        values: [
            statuses.CREATED,
            statuses.PENDING,
            statuses.ACTIVE,
            statuses.DELETED,
        ],
        defaultValue: statuses.CREATED,
    },
    // the following properties may be optionally
    // populated with a backend middleware
    {
        name: 'createdBy',
        type: ObjectProperty_1.ObjectProperty.TYPE,
        instanceOf: 'User',
        mandatory: true,
        protected: true,
    },
    {
        name: 'createdAt',
        type: DateTimeProperty_1.DateTimeProperty.TYPE,
        mandatory: true,
        protected: true,
    },
    {
        name: 'updatedBy',
        type: ObjectProperty_1.ObjectProperty.TYPE,
        instanceOf: 'User',
    },
    {
        name: 'updatedAt',
        type: DateTimeProperty_1.DateTimeProperty.TYPE,
    },
    {
        name: 'deletedBy',
        type: ObjectProperty_1.ObjectProperty.TYPE,
        instanceOf: 'User',
        protected: true,
    },
    {
        name: 'deletedAt',
        type: DateTimeProperty_1.DateTimeProperty.TYPE,
        protected: true,
    },
];
