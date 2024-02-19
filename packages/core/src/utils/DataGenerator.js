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
exports.DataGenerator = void 0;
const Core_1 = require("../Core");
const htmlType = __importStar(require("../properties/types/PropertyHTMLType"));
const faker_1 = require("@faker-js/faker");
/**
 * Generate data from model of object and save it in default backend
 * @param model
 * @param qty
 * @param forcedValues
 * @returns
 */
const DataGenerator = (model, qty = 5, forcedValues = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = [];
    Core_1.Core.log(`Starting to create ${qty} ${model.constructor.name} records`);
    for (let i = 0; i < qty; i++) {
        const dao = yield model.core.dataObject.clone(); //model.dataObject.toJSON())
        Object.keys(dao.properties).forEach((key) => {
            const property = dao.get(key);
            if (forcedValues[key]) {
                property.set(forcedValues[key]);
                return;
            }
            switch (property.constructor.name) {
                case 'StringProperty':
                    switch (property.htmlType) {
                        case htmlType.GIVEN_NAME:
                            property.set(faker_1.faker.name.firstName());
                            break;
                        case htmlType.FAMILY_NAME:
                            property.set(faker_1.faker.name.lastName());
                            break;
                        case htmlType.EMAIL:
                            property.set(faker_1.faker.helpers.unique(faker_1.faker.internet.email));
                            break;
                        case htmlType.ORG:
                            property.set(faker_1.faker.company.name());
                        default:
                            property.set(faker_1.faker.word.noun());
                            break;
                    }
                    break;
                case 'EnumProperty':
                    property.set(faker_1.faker.helpers.arrayElement(property.values));
                    break;
                case 'HashProperty':
                    property.set(faker_1.faker.random.alphaNumeric(16));
                    break;
                case 'DateTimeProperty':
                    switch (property.htmlType) {
                        case htmlType.BIRTHDAY:
                            property.set(faker_1.faker.date.birthdate());
                            break;
                        default:
                            //property.set(faker.date.future())
                            break;
                    }
                    break;
                default:
                    break;
            }
        });
        yield dao.save();
        promises.push(dao);
    }
    return promises;
});
exports.DataGenerator = DataGenerator;
