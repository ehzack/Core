"use strict";
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
exports.BaseObjectCore = void 0;
const ObjectUri_1 = require("./ObjectUri");
const AbstractObject_1 = require("./AbstractObject");
const BaseObject_1 = require("./BaseObject");
const Query_1 = require("../backends/Query");
const DataObject_1 = require("./DataObject");
const ProxyConstructor_1 = require("./types/ProxyConstructor");
class BaseObjectCore extends AbstractObject_1.AbstractObject {
    static getProperty(key) {
        return BaseObjectCore.PROPS_DEFINITION.find((prop) => prop.name === key);
    }
    static fillProperties(child = this) {
        // merge base properties with additional or redefined ones
        const base = [...BaseObjectCore.PROPS_DEFINITION];
        child.PROPS_DEFINITION.forEach((property) => {
            // manage parent properties potential redeclaration
            const found = base.findIndex((el) => el.name === property.name);
            if (found !== -1) {
                base[found] = property;
            }
            else {
                base.push(property);
            }
        });
        const dao = DataObject_1.DataObject.factory({ properties: base });
        dao.uri.class = child;
        return dao;
    }
    static daoFactory(src = undefined, child = this) {
        return __awaiter(this, void 0, void 0, function* () {
            const dao = this.fillProperties(child);
            if (src instanceof ObjectUri_1.ObjectUri) {
                dao.uri = src;
                yield dao.read();
            }
            else if (typeof src == 'string') {
                dao.uri.path = src;
                yield dao.read();
            }
            return dao;
        });
    }
    /**
     * Instantiates from an object
     * @param src
     * @param child
     * @returns
     */
    static fromObject(src, child = this) {
        const dao = this.fillProperties(child);
        dao.uri = new ObjectUri_1.ObjectUri(`${this.COLLECTION}${ObjectUri_1.ObjectUri.DEFAULT}`, Reflect.get(src, 'name'));
        dao.uri.class = child;
        dao.populateFromData(src);
        const obj = new this(dao);
        return obj;
    }
    static factory(src = undefined, child = this) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof src == 'object' && !(src instanceof ObjectUri_1.ObjectUri)) {
                    return this.fromObject(src);
                }
                const dao = yield this.daoFactory(src, child);
                const constructedObject = Reflect.construct(this, [dao]);
                return constructedObject.toProxy();
            }
            catch (err) {
                throw new Error(`Unable to build instance for '${this.name}': ${err.message}`);
            }
        });
    }
    /**
     * Fetches an object from its backend path
     * @param path
     * @returns
     */
    static fromBackend(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!path.includes('/')) {
                return this.factory(`${this.COLLECTION}/${path}`);
            }
            return this.factory(path);
        });
    }
    /**
     * Instantiates from a DataObject
     * @param dao
     * @returns
     */
    static fromDataObject(dao) {
        const obj = new this(dao);
        return obj; //.toProxy()
    }
    /**
     * Wrap instance into proxy to get access to properties
     * @returns Proxy
     */
    toProxy() {
        return new ProxyConstructor_1.ProxyConstructor(this, {
            get: (target, prop) => {
                if (prop === 'uid') {
                    return target.uid;
                }
                if (prop === 'uri') {
                    return target.uri;
                }
                if (prop == 'toJSON') {
                    return target.toJSON;
                }
                if (prop == 'save') {
                    return target.save;
                }
                if (prop == 'constructor') {
                    return target.constructor;
                }
                if (prop === 'core') {
                    return target;
                }
                // i don't know why and i shouldn't have to wonder why
                // but everything crashes unless we do this terribleness
                if (prop == 'then') {
                    return;
                }
                return target.val(prop);
            },
            set(target, prop, newValue) {
                if (prop === 'uid' || prop === 'core') {
                    throw new Error(`Property '${prop}' is readonly`);
                }
                target.set(prop, newValue);
                return true;
            },
        });
    }
    asReference() {
        return this._dataObject.toReference();
    }
    query() {
        return new Query_1.Query(this.constructor.prototype);
    }
    static query() {
        return new Query_1.Query(this);
    }
}
exports.BaseObjectCore = BaseObjectCore;
BaseObjectCore.PROPS_DEFINITION = BaseObject_1.BaseObjectProperties;
