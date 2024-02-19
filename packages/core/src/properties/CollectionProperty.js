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
exports.CollectionProperty = void 0;
const BaseProperty_1 = require("./BaseProperty");
const Core_1 = require("../Core");
const Query_1 = require("../backends/Query");
class CollectionProperty extends BaseProperty_1.BaseProperty {
    constructor(config) {
        var _a, _b;
        super(config);
        this._value = undefined;
        this._filters = undefined;
        if (!config.instanceOf) {
            throw new Error('Parameter instanceOf is mandatory');
        }
        this._instanceOf =
            typeof config.instanceOf === 'string'
                ? Core_1.Core.classRegistry[config.instanceOf]
                : config.instanceOf;
        this._backend = config.backend
            ? Core_1.Core.getBackend(config.backend)
            : undefined;
        this._parentKey =
            config.parentKey || ((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a.uri) === null || _b === void 0 ? void 0 : _b.collection) || 'unknown';
        this._query = this._setQuery();
    }
    _setQuery(filters) {
        const query = this._instanceOf.query();
        query.where(this._parentKey, this._parent ? this._parent.uri : 'unknown');
        if (filters) {
            query.filters = filters;
        }
        return query;
    }
    set(value) {
        return super.set(value);
    }
    /**
     * get objects matching collection class and filters
     * in the requested format
     * @param filters
     * @returns
     */
    get(filters = undefined) {
        if (!this._query || this._filters !== filters) {
            this._query = this._setQuery(filters);
        }
        return this._query;
    }
    val(transform = Query_1.returnAs.AS_DATAOBJECTS) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get().execute(transform, this._backend);
        });
    }
    toJSON() {
        return this._value;
    }
}
exports.CollectionProperty = CollectionProperty;
CollectionProperty.TYPE = 'collection';
