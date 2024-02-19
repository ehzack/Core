"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProperty = void 0;
const BaseProperty_1 = require("./BaseProperty");
class MapProperty extends BaseProperty_1.BaseProperty {
    set(value) {
        if (typeof value !== 'object') {
            throw new Error(`value ${JSON.stringify(value)} is not an object`);
        }
        return super.set(value);
    }
    toJSON() {
        return this._value ? JSON.stringify(this._value) : {};
    }
}
exports.MapProperty = MapProperty;
MapProperty.TYPE = 'map';
