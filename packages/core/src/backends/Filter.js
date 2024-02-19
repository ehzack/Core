"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = void 0;
/**
 * Filter object
 */
class Filter {
    constructor(prop, value, operator = 'equals') {
        this.prop = prop;
        this.operator = operator;
        this.value = value;
    }
}
exports.Filter = Filter;
