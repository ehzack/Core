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
exports.AbstractAdapter = void 0;
const BackendError_1 = require("./BackendError");
class AbstractAdapter {
    constructor(params = {}) {
        this._alias = '';
        this._params = {};
        this._middlewares = [];
        this._alias = params.alias || '';
        this._middlewares = params.middlewares || [];
    }
    setParam(key, value) {
        this._params[key] = value;
    }
    getParam(key) {
        return this._params[key];
    }
    addMiddleware(middleware) {
        if (this.hasMiddleware(middleware.constructor.name)) {
            throw new BackendError_1.BackendError(`Middleware '${middleware.constructor.name}' is already attached`);
        }
        this._middlewares.push(middleware);
    }
    /**
     * Returns true if a given middleware is attached
     * @param className
     * @returns boolean
     */
    hasMiddleware(className) {
        let has = false;
        this._middlewares.forEach((middleware) => {
            if (middleware.constructor.name === className) {
                has = true;
            }
        });
        return has;
    }
    set alias(alias) {
        this._alias = alias;
    }
    get alias() {
        return this._alias;
    }
    getCollection(dao) {
        return dao.uri.collection; //|| dao.uri.class.name.toLowerCase() //class.COLLECTION
    }
    /**
     * Process Query instance and return result
     * @param query
     * @returns Array
     */
    query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.find(yield query.obj.daoFactory(), query.filters, query.sortAndLimit);
        });
    }
    log(message) {
        if (this._params['debug'] === true) {
            console.log(message);
        }
    }
    executeMiddlewares(dataObject, action) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const middleware of this._middlewares) {
                yield middleware.execute(dataObject, action);
            }
            return dataObject;
        });
    }
}
exports.AbstractAdapter = AbstractAdapter;
