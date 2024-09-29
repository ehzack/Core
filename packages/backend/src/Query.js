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
exports.Query = exports.AS_INSTANCES = exports.AS_DATAOBJECTS = exports.AS_OBJECTURIS = void 0;
const Backend_1 = require("./Backend");
const Filter_1 = require("./Filter");
const Limits_1 = require("./Limits");
const Sorting_1 = require("./Sorting");
const SortAndLimit_1 = require("./SortAndLimit");
const core_1 = require("@quatrain/core");
exports.AS_OBJECTURIS = 'objectUris';
exports.AS_DATAOBJECTS = 'dataObjects';
exports.AS_INSTANCES = 'classInstances';
class Query {
    constructor(obj, parent) {
        this._obj = obj;
        this._parent = parent;
        this.filters = [];
        this.sortings = [];
        this.limits = new Limits_1.Limits();
        this.meta = {};
    }
    get obj() {
        return this._obj;
    }
    get parent() {
        return this._parent;
    }
    /**
     * Declare query parent record
     * This may be need in some NoSQL backend to query subcollections
     */
    set parent(parent) {
        this._parent = parent;
    }
    where(param, value = null, operator = 'equals') {
        if (typeof param == 'object') {
            this.filters.push(param);
        }
        else {
            if (operator === 'equals' && Array.isArray(value)) {
                // auto-convert operator if value is an array
                operator = 'contains';
            }
            this.filters.push(new Filter_1.Filter(param, value, operator));
        }
        return this;
    }
    sortBy(param, order = 'asc') {
        if (typeof param == 'object') {
            this.sortings.push(param);
        }
        else {
            this.sortings.push(new Sorting_1.Sorting(param, order));
        }
        return this;
    }
    setLimits(limits) {
        this.limits = limits;
        return this;
    }
    offset(offset = 0) {
        this.limits.offset = offset;
        return this;
    }
    batch(batch = 10) {
        this.limits.batch = batch;
        return this;
    }
    get sortAndLimit() {
        return new SortAndLimit_1.SortAndLimit(this.sortings, this.limits);
    }
    fetch(backend = Backend_1.Backend.getBackend()) {
        return __awaiter(this, void 0, void 0, function* () {
            return backend.query(this);
        });
    }
    fetchAsUri(backend = Backend_1.Backend.getBackend()) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, meta } = yield this.fetch(backend);
            return { items: yield Promise.all(items.map((dao) => dao.uri)), meta };
        });
    }
    fetchAsInstances(backend = Backend_1.Backend.getBackend()) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, meta } = yield this.fetch(backend);
            const instances = [];
            for (const item of items) {
                instances.push(this._obj.fromDataObject(item));
            }
            return { items: instances, meta };
        });
    }
    execute(as = core_1.returnAs.AS_DATAOBJECTS, backend = Backend_1.Backend.getBackend(this._obj.DEFAULT_BACKEND)) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (as) {
                    case exports.AS_DATAOBJECTS:
                        return yield this.fetch(backend);
                    case exports.AS_OBJECTURIS:
                        return yield this.fetchAsUri(backend);
                    case exports.AS_INSTANCES:
                        return yield this.fetchAsInstances(backend);
                    default:
                        throw new Error(`Unknown output mode`);
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
}
exports.Query = Query;
