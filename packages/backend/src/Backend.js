"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend = exports.BackendAction = void 0;
const core_1 = require("@quatrain/core");
var BackendAction;
(function (BackendAction) {
    BackendAction["CREATE"] = "create";
    BackendAction["READ"] = "read";
    BackendAction["UPDATE"] = "update";
    BackendAction["DELETE"] = "delete";
    BackendAction["WRITE"] = "write";
})(BackendAction || (exports.BackendAction = BackendAction = {}));
class Backend extends core_1.Core {
    static addBackend(backend, alias, setDefault = false) {
        this._backends[alias] = backend;
        if (setDefault) {
            this.defaultBackend = alias;
        }
    }
    static getBackend(alias = this.defaultBackend) {
        if (this._backends[alias]) {
            return this._backends[alias];
        }
        else {
            throw new Error(`Unknown backend alias: '${alias}'`);
        }
    }
    static log(message, src = 'Backend') {
        super.log(message, src);
    }
}
exports.Backend = Backend;
Backend.defaultBackend = '@default';
Backend._backends = {};
