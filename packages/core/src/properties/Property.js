"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const BaseProperty_1 = require("./BaseProperty");
const BooleanProperty_1 = require("./BooleanProperty");
const DateTimeProperty_1 = require("./DateTimeProperty");
const EnumProperty_1 = require("./EnumProperty");
const HashProperty_1 = require("./HashProperty");
const StringProperty_1 = require("./StringProperty");
const NumberProperty_1 = require("./NumberProperty");
const ObjectProperty_1 = require("./ObjectProperty");
const CollectionProperty_1 = require("./CollectionProperty");
const ArrayProperty_1 = require("./ArrayProperty");
const MapProperty_1 = require("./MapProperty");
class Property {
    static factory(params, parent) {
        params.parent = parent;
        switch (params.type) {
            case BaseProperty_1.BaseProperty.TYPE:
                return new BaseProperty_1.BaseProperty(params);
            case StringProperty_1.StringProperty.TYPE:
                return new StringProperty_1.StringProperty(params);
            case NumberProperty_1.NumberProperty.TYPE:
                return new NumberProperty_1.NumberProperty(params);
            case ObjectProperty_1.ObjectProperty.TYPE:
                return new ObjectProperty_1.ObjectProperty(params);
            case EnumProperty_1.EnumProperty.TYPE:
                return new EnumProperty_1.EnumProperty(params);
            case BooleanProperty_1.BooleanProperty.TYPE:
                return new BooleanProperty_1.BooleanProperty(params);
            case HashProperty_1.HashProperty.TYPE:
                return new HashProperty_1.HashProperty(params);
            case DateTimeProperty_1.DateTimeProperty.TYPE:
                return new DateTimeProperty_1.DateTimeProperty(params);
            case CollectionProperty_1.CollectionProperty.TYPE:
                if (!('instanceOf' in params)) {
                    throw new Error('Missing property instanceOf!');
                }
                return new CollectionProperty_1.CollectionProperty(params);
            case ArrayProperty_1.ArrayProperty.TYPE:
                return new ArrayProperty_1.ArrayProperty(params);
            case MapProperty_1.MapProperty.TYPE:
                return new MapProperty_1.MapProperty(params);
            default:
                throw new Error(`Unknown property type ${params.type}`);
        }
    }
}
exports.Property = Property;
Property.TYPE_ANY = 'any';
Property.TYPE_NUMBER = 'number';
Property.TYPE_STRING = 'string';
Property.TYPE_OBJECT = 'object';
Property.TYPE_ENUM = 'enum';
Property.TYPE_BOOLEAN = 'boolean';
Property.TYPE_HASH = 'hash';
Property.TYPE_DATETIME = 'datetime';
Property.TYPE_ARRAY = 'array';
Property.TYPE_MAP = 'map';
