"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringProperty = void 0;
//import { Property } from './Property'
const BaseProperty_1 = require("./BaseProperty");
class StringProperty extends BaseProperty_1.BaseProperty {
    constructor(config) {
        super(config);
        this._minLength = 0;
        this._maxLength = 0;
        this._fullSearch = false;
        /**
         * Set to false to bypass some rules
         */
        this._rawValue = true;
        this.minLength = config.minLength || 0;
        this.maxLength = config.maxLength || 0;
        this.fullSearch = config.fullSearch || false;
        this._htmlType = config.htmlType || 'off';
        if (this._enable(config.allowSpaces)) {
            this._allows.push(StringProperty.ALLOW_SPACES);
        }
        if (this._enable(config.allowDigits)) {
            this._allows.push(StringProperty.ALLOW_DIGITS);
        }
        if (this._enable(config.allowLetters)) {
            this._allows.push(StringProperty.ALLOW_LETTERS);
        }
    }
    set(value) {
        if (value !== null && value !== undefined) {
            if (this._allows.includes(StringProperty.ALLOW_DIGITS) === false &&
                /\d/.test(value)) {
                throw new Error(`Digits are not allowed in value`);
            }
            if (this._allows.includes(StringProperty.ALLOW_SPACES) === false &&
                /\s/g.test(value)) {
                throw new Error(`Spaces are not allowed in value`);
            }
            if (this._allows.includes(StringProperty.ALLOW_LETTERS) === false &&
                /[a-zA-Z]/.test(value)) {
                throw new Error(`Letters are not allowed in value`);
            }
            if (this._rawValue &&
                this._minLength > 0 &&
                value.length < this._minLength) {
                throw new Error(`Value is too short`);
            }
            if (this._rawValue &&
                this._maxLength > 0 &&
                value.length > this._maxLength) {
                throw new Error(`${this._name}: value '${value}' is too long`);
            }
        }
        return super.set(value);
    }
    get(transform = undefined) {
        switch (transform) {
            case StringProperty.TRANSFORM_LCASE:
                return this._value && this._value.toLowerCase();
            case StringProperty.TRANSFORM_UCASE:
                return this._value && this._value.toUpperCase();
            default:
                return this._value;
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
    set fullSearch(mode) {
        this._fullSearch = mode;
    }
    get fullSearch() {
        return this._fullSearch;
    }
}
exports.StringProperty = StringProperty;
StringProperty.TYPE = 'string';
StringProperty.TRANSFORM_UCASE = 'upper';
StringProperty.TRANSFORM_LCASE = 'lower';
StringProperty.ALLOW_SPACES = 'spaces';
StringProperty.ALLOW_LETTERS = 'letters';
StringProperty.ALLOW_DIGITS = 'digits';
StringProperty.ALLOW_STRINGS = 'strings';
StringProperty.ALLOW_NUMBERS = 'numbers';
