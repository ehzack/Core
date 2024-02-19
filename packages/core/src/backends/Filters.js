"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filters = void 0;
class Filters {
    constructor(or, and) {
        if (or) {
            this.or = or;
        }
        if (and) {
            this.and = and;
        }
    }
}
exports.Filters = Filters;
