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
exports.AbstractObject = void 0;
class AbstractObject {
    constructor(dao) {
        this._dataObject = dao;
    }
    /**
     * Return property object matching key
     * @param key string
     * @returns
     */
    get(key) {
        return this._dataObject.get(key);
    }
    set(key, val) {
        return this._dataObject.set(key, val);
    }
    val(key) {
        const prop = this.get(key);
        if (prop) {
            return prop.val();
        }
        else {
            throw new Error(`${key} is not a valid property`);
        }
    }
    get backend() {
        return this._dataObject.backend;
    }
    get path() {
        return this._dataObject.path;
    }
    get uid() {
        return this._dataObject.uid;
    }
    get dataObject() {
        return this._dataObject;
    }
    get _() {
        return this._dataObject.asProxy();
    }
    get uri() {
        return this._dataObject.uri;
    }
    toJSON() {
        var _a;
        return typeof this.uri === 'string' ? this.uri : (_a = this.uri) === null || _a === void 0 ? void 0 : _a.toJSON();
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._dataObject.save();
            return this;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._dataObject.delete();
        });
    }
}
exports.AbstractObject = AbstractObject;
AbstractObject.PROPS_DEFINITION = [];
// Which property's value to use in backend as label for object reference
AbstractObject.LABEL_KEY = 'name';
