"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProperty = void 0;
class BaseProperty {
    constructor(config) {
        this._value = undefined;
        this._mandatory = false;
        this._protected = false;
        this._allows = [];
        this._htmlType = 'off';
        this._events = {};
        this._parent = config.parent;
        this._name = config.name;
        this._protected = config.protected || false;
        this._mandatory = config.mandatory || false;
        this._defaultValue = config.defaultValue;
        this._value = config.defaultValue;
        this._htmlType = config.htmlType || 'off';
        if (typeof config.onChange === 'function') {
            this._events.onChange = config.onChange;
        }
    }
    get name() {
        return this._name;
    }
    get mandatory() {
        return this._mandatory;
    }
    get protected() {
        return this._protected;
    }
    get allows() {
        return this._allows;
    }
    set htmlType(type) {
        this._htmlType = type;
    }
    get htmlType() {
        return this._htmlType;
    }
    set(value) {
        if (this._value !== undefined &&
            this._value !== null &&
            this._value !== this._defaultValue &&
            this._protected === true) {
            throw new Error(`Value '${this._name}' already defined as '${this._value}' and protected from change`);
        }
        this._value = value;
        if (this._events[BaseProperty.EVENT_ONCHANGE]) {
            this._events[BaseProperty.EVENT_ONCHANGE](this._parent);
        }
        return this;
    }
    val(transform = undefined) {
        return transform ? transform(this._value) : this._value || this._defaultValue;
    }
    _enable(value) {
        return value === undefined || value === true;
    }
    toJSON() {
        return this._value;
    }
    clone() {
        const cloned = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return cloned;
    }
}
exports.BaseProperty = BaseProperty;
BaseProperty.TYPE = 'any';
BaseProperty.EVENT_ONCHANGE = 'onChange';
BaseProperty.EVENT_ONDELETE = 'onDelete';
