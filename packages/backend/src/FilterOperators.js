"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterOperator = void 0;
var FilterOperator;
(function (FilterOperator) {
    FilterOperator[FilterOperator["equals"] = 0] = "equals";
    FilterOperator[FilterOperator["notEquals"] = 1] = "notEquals";
    FilterOperator[FilterOperator["greater"] = 2] = "greater";
    FilterOperator[FilterOperator["greaterOrEquals"] = 3] = "greaterOrEquals";
    FilterOperator[FilterOperator["lower"] = 4] = "lower";
    FilterOperator[FilterOperator["lowerOrEquals"] = 5] = "lowerOrEquals";
    FilterOperator[FilterOperator["contains"] = 6] = "contains";
    FilterOperator[FilterOperator["notContains"] = 7] = "notContains";
    FilterOperator[FilterOperator["containsAll"] = 8] = "containsAll";
    FilterOperator[FilterOperator["containsAny"] = 9] = "containsAny";
})(FilterOperator || (exports.FilterOperator = FilterOperator = {}));
