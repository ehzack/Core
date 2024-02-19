"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const DataObject_1 = require("./components/DataObject");
const User_1 = require("./components/User");
class Core {
    static definition(key) {
        return {
            manifest: {
                type: String,
                mandatory: true,
            },
        };
    }
    static addBackend(backend, alias, setDefault = false) {
        Core._backends[alias] = backend;
        if (setDefault) {
            Core.defaultBackend = alias;
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
    static addClass(name, obj) {
        Core.classRegistry[name] = obj;
    }
    static getClass(name) {
        return Core.classRegistry[name];
    }
    /**
     * Returns the class to use for a data object
     * This is currently just a stub that will be implemented from config in the future
     * @returns DataObjectClass
     */
    static getDataObjectClass() {
        return DataObject_1.DataObject.prototype;
    }
    /**
     * Log message using defined logger
     * This is currently just a stub that will be implemented from config in the future
     * @param message string | object
     * @param level string
     */
    static log(message, src = 'Core', level = 'NOTICE') {
        Core.logger.log(`${Date.now()} - [${src}] ${typeof message === 'string' ? message : JSON.stringify(message)}`);
    }
}
exports.Core = Core;
Core.defaultBackend = '@default';
Core.userClass = User_1.User;
Core.classRegistry = {};
Core.logger = console;
// How timestamp are formatted
Core.timestamp = () => new Date().toISOString();
Core._backends = {};
