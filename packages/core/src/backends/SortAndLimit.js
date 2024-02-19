"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortAndLimit = void 0;
const Limits_1 = require("./Limits");
class SortAndLimit {
    constructor(sortings = [], limits = undefined) {
        this.sortings = sortings;
        this.limits = limits || new Limits_1.Limits();
    }
}
exports.SortAndLimit = SortAndLimit;
