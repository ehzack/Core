"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanProperty = void 0;
const BaseProperty_1 = require("./BaseProperty");
class BooleanProperty extends BaseProperty_1.BaseProperty {
    set(value) {
        return super.set(value);
    }
}
exports.BooleanProperty = BooleanProperty;
BooleanProperty.TYPE = 'boolean';
