"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeProperty = void 0;
const BaseProperty_1 = require("./BaseProperty");
class DateTimeProperty extends BaseProperty_1.BaseProperty {
    constructor(config) {
        super(config);
        this._timezone = config.timezone || 'Z';
    }
    set(value) {
        return super.set(value);
    }
    get timezone() {
        return this._timezone;
    }
}
exports.DateTimeProperty = DateTimeProperty;
DateTimeProperty.TYPE = 'datetime';
