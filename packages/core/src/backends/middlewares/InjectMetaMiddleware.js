"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectMetaMiddleware = void 0;
const Backend_1 = require("../../Backend");
class InjectMetaMiddleware {
    constructor(params) {
        this._user = params.user;
    }
    execute(dataObject, action) {
        switch (action) {
            // add properties existence validation
            case Backend_1.BackendAction.CREATE:
                dataObject.set('createdBy', this._user);
                dataObject.set('createdAt', Date.now());
                break;
            case Backend_1.BackendAction.UPDATE:
                dataObject.set('updatedBy', this._user);
                dataObject.set('updatedAt', Date.now());
                break;
            case Backend_1.BackendAction.DELETE:
                dataObject.set('deletedBy', this._user);
                dataObject.set('deletedAt', Date.now());
                break;
            default:
                break;
        }
        return;
    }
}
exports.InjectMetaMiddleware = InjectMetaMiddleware;
