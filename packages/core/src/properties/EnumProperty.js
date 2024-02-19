"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumProperty = void 0;
const BaseProperty_1 = require("./BaseProperty");
class EnumProperty extends BaseProperty_1.BaseProperty {
    constructor(config) {
        super(config);
        this._values = [];
        this._values = config.values || [];
    }
    set(value) {
        if (value !== null && !this._values.includes(value)) {
            throw new Error(`Value '${value}' is not acceptable`);
        }
        return super.set(value);
    }
    get values() {
        return this._values;
    }
}
exports.EnumProperty = EnumProperty;
EnumProperty.TYPE = 'enum';
