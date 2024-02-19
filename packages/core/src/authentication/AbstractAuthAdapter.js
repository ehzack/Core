"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractAuthAdapter = void 0;
class AbstractAuthAdapter {
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
        this._middlewares.push(middleware);
    }
    set alias(alias) {
        this._alias = alias;
    }
    get alias() {
        return this._alias;
    }
}
exports.AbstractAuthAdapter = AbstractAuthAdapter;
