"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectProperty = void 0;
const DataObject_1 = require("../components/DataObject");
const ObjectUri_1 = require("../components/ObjectUri");
const BaseProperty_1 = require("./BaseProperty");
const Query_1 = require("../backends/Query");
const Core_1 = require("../Core");
class ObjectProperty extends BaseProperty_1.BaseProperty {
    constructor(config) {
        super(config);
        this._value = undefined;
        this._instanceOf = config.instanceOf;
    }
    val(transform = undefined) {
        if (typeof this._instanceOf === 'string') {
            console.log(`Getting instance from string ${this._instanceOf}`);
            this._instanceOf = Core_1.Core.getClass(this._instanceOf);
            //throw new Error(`Parameter 'instanceOf' was not properly setted`)
        }
        if (!this._value) {
            return this._defaultValue;
        }
        switch (transform) {
            case Query_1.returnAs.AS_DATAOBJECTS:
                if (this._value instanceof DataObject_1.DataObject) {
                    console.log(`Returning already existing dataObject`);
                    return this._value;
                }
                else if (this._value instanceof ObjectUri_1.ObjectUri) {
                    console.log(`Converting objectUri -> dataObject`);
                    return DataObject_1.DataObject.factory({
                        properties: Reflect.get(this._instanceOf, 'PROPS_DEFINITION'),
                        uri: this._value,
                    });
                }
                else {
                    console.log(`Converting instance -> dataObject`);
                    return this._value.dataObject;
                }
            case Query_1.returnAs.AS_INSTANCES:
                if (this._value instanceof DataObject_1.DataObject) {
                    console.log(`Converting dataObject -> instance`);
                    return Reflect.construct(this._instanceOf, [this._value]);
                }
                else if (this._value instanceof ObjectUri_1.ObjectUri) {
                    console.log('ObjectProperty', this);
                    console.log(`Converting objectUri -> dataObject -> instance`);
                    console.log(this._instanceOf);
                    const dao = DataObject_1.DataObject.factory({
                        properties: Reflect.get(this._instanceOf, 'PROPS_DEFINITION'),
                        uri: this._value,
                    });
                    return Reflect.construct(this._instanceOf, [dao]);
                }
                else {
                    console.log(`Returning already existing instance`);
                    return this._value;
                }
                return this._value;
            case Query_1.returnAs.AS_OBJECTURIS:
            default:
                return this._value;
        }
    }
    set(value) {
        if (value instanceof ObjectUri_1.ObjectUri &&
            value instanceof DataObject_1.DataObject &&
            value.constructor.name !== this._instanceOf.constructor.name) {
            throw new Error(`value ${JSON.stringify(value)} is not an instance of ${this._instanceOf.constructor.name}`);
        }
        return super.set(value);
    }
    toJSON() {
        if (this._value instanceof ObjectUri_1.ObjectUri) {
            return this._value.toJSON();
        }
        return this._value &&
            (this._value.dataObject || this._value instanceof DataObject_1.DataObject)
            ? this._value.dataObject.toReference()
            : null;
    }
}
exports.ObjectProperty = ObjectProperty;
ObjectProperty.TYPE = 'object';
