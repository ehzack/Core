"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayProperty = void 0;
const BaseProperty_1 = require("./BaseProperty");
const StringProperty_1 = require("./StringProperty");
class ArrayProperty extends BaseProperty_1.BaseProperty {
    constructor(config) {
        super(config);
        this._value = undefined;
        this._minLength = 0;
        this._maxLength = 0;
        this.minLength = config.minLength || 0;
        this.maxLength = config.maxLength || 0;
        if (this._enable(config.allowNumbers)) {
            this._allows.push(StringProperty_1.StringProperty.ALLOW_NUMBERS);
        }
        if (this._enable(config.allowStrings)) {
            this._allows.push(StringProperty_1.StringProperty.ALLOW_STRINGS);
        }
    }
    set minLength(min) {
        this._minLength = min >= 0 ? min : 0;
    }
    get minLength() {
        return this._minLength;
    }
    set maxLength(max) {
        this._maxLength = max >= 0 ? max : 0;
    }
    get maxLength() {
        return this._maxLength;
    }
    set(value) {
        if (!Array.isArray(value)) {
            throw new Error(`value ${JSON.stringify(value)} is not an array`);
        }
        if (this._minLength > 0 && value.length < this._minLength) {
            throw new Error(`Array has too few values`);
        }
        if (this._maxLength > 0 && value.length > this._maxLength) {
            throw new Error(`Array values are too many`);
        }
        const joined = value.join();
        if (this._allows.includes(StringProperty_1.StringProperty.ALLOW_STRINGS) === false &&
            /[a-zA-Z]/.test(joined)) {
            throw new Error(`Strings are not allowed in value`);
        }
        if (this._allows.includes(StringProperty_1.StringProperty.ALLOW_NUMBERS) === false &&
            /\d/.test(joined)) {
            throw new Error(`Numbers are not allowed in value`);
        }
        return super.set(value);
    }
    get(transform = undefined) {
        return transform ? transform(this._value) : this._value;
    }
    toJSON() {
        return this._value;
    }
}
exports.ArrayProperty = ArrayProperty;
ArrayProperty.TYPE = 'array';
