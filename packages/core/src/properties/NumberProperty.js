"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberProperty = void 0;
const BaseProperty_1 = require("./BaseProperty");
class NumberProperty extends BaseProperty_1.BaseProperty {
    constructor(config) {
        super(config);
        this._minVal = undefined;
        this._maxVal = undefined;
        this._type = NumberProperty.TYPE_INTEGER;
        this._sign = NumberProperty.TYPE_SIGNED;
        this._prefix = '';
        this._suffix = '';
        this._precision = 0;
        this.minVal = config.minVal || undefined;
        this.maxVal = config.maxVal || undefined;
        this._prefix = config.prefix
            ? `${config.prefix}${NumberProperty.SEPARATOR}`
            : '';
        this._suffix = config.suffix
            ? `${NumberProperty.SEPARATOR}${config.suffix}`
            : '';
        if (config.type) {
            this._type = config.type;
        }
        if (config.sign) {
            this._sign = config.sign;
        }
    }
    set(value) {
        if (this._sign === NumberProperty.TYPE_UNSIGNED && value < 0) {
            throw new Error(`Value must be unsigned`);
        }
        if (this._minVal && value < this._minVal) {
            throw new Error(`Value is below ${this._minVal}`);
        }
        if (this._maxVal && value > this._maxVal) {
            throw new Error(`Value is above ${this._maxVal}`);
        }
        if (this._type === NumberProperty.TYPE_INTEGER) {
            value = Math.floor(value);
        }
        return super.set(value);
    }
    val(transform = undefined) {
        switch (transform) {
            case NumberProperty.TRANSFORM_FORMATTED:
                return `${this._prefix}${this._value}${this._suffix}`;
            default:
                return this._value;
        }
    }
    set minVal(min) {
        this._minVal = min;
    }
    get minVal() {
        return this._minVal;
    }
    set maxVal(max) {
        this._maxVal = max;
    }
    get maxVal() {
        return this._maxVal;
    }
    get type() {
        return this._type;
    }
}
exports.NumberProperty = NumberProperty;
NumberProperty.TYPE = 'number';
NumberProperty.TYPE_SIGNED = 'signed';
NumberProperty.TYPE_UNSIGNED = 'unsigned';
NumberProperty.TYPE_INTEGER = 'integer';
NumberProperty.TYPE_FLOAT = 'float';
NumberProperty.SEPARATOR = ' ';
NumberProperty.TRANSFORM_FORMATTED = 'formatted';
