"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataObject = void 0;
const Core_1 = require("../Core");
const Property_1 = require("../properties/Property");
const ObjectUri_1 = require("./ObjectUri");
const ResourcesErrors_1 = require("../common/ResourcesErrors");
/**
 * Data objects constitute the agnostic glue between objects and backends.
 * They handle data and identifiers in a protected registry
 * This is what backends and objects manipulate, oblivious of the other.
 */
class DataObject {
    /**
     * Constructor is protected, use factory() instead
     * @param params object of parameters
     */
    constructor(params) {
        this._uid = undefined;
        this._properties = {};
        this._persisted = false;
        this._populated = false;
        /**
         * Has data been modified since last backend operation?
         */
        this._modified = false;
        if (params) {
            if (typeof params.uri !== 'object') {
                this._objectUri = new ObjectUri_1.ObjectUri(params.uri);
            }
            else {
                this._objectUri = params.uri;
            }
        }
        else {
            this._objectUri = new ObjectUri_1.ObjectUri();
        }
        if (params && Array.isArray(params.properties)) {
            this._init(params.properties);
        }
    }
    _init(properties) {
        properties.forEach((prop) => {
            this._properties[prop.name] = Property_1.Property.factory(prop, this);
        });
    }
    /**
     * Wrap instance into proxy to get access to properties
     * @returns Proxy
     */
    asProxy() {
        return new Proxy(this, {
            get: (target, prop) => {
                return target.val(prop);
            },
            set(target, prop, newValue) {
                if (prop === 'uid' || prop === 'core') {
                    throw new Error(`Property '${prop}' is readonly`);
                }
                target.set(prop, newValue);
                return true;
            },
        });
    }
    setProperties(properties) {
        // TODO check if doable
        this._properties = properties;
    }
    addProperty(property) {
        if (Object.keys(this._properties).includes(property.name)) {
            throw new Error(`Property ${name} already exists`);
        }
        this._properties[property.name] = property;
    }
    /**
     * Populate data object from instant data or backend query
     * @param data
     */
    populate(data = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._populated === false) {
                if (data) {
                    this.populateFromData(data);
                }
                else if (this.path !== '/' && this.path !== '') {
                    yield this.populateFromBackend();
                }
                this._populated = true;
                if (Reflect.get(this._properties, 'name')) {
                    this.uri.label = this.val('name');
                }
            }
            return this;
        });
    }
    /**
     * Populate data object from instant data or backend query
     * @param data
     */
    populateFromData(data) {
        if (this._populated === false) {
            for (const key in data) {
                if (Reflect.get(this._properties, key)) {
                    const val = data[key];
                    if (val &&
                        typeof val === 'object' &&
                        'ref' in val &&
                        typeof val.ref == 'string' &&
                        'label' in val &&
                        typeof val.label == 'string') {
                        const { ref, label } = val;
                        Reflect.get(this._properties, key).set(new ObjectUri_1.ObjectUri(ref, label));
                    }
                    else {
                        Reflect.get(this._properties, key).set(data[key]);
                    }
                }
            }
            this._populated = true;
            if (Reflect.get(this._properties, 'name')) {
                this.uri.label = this.val('name');
            }
        }
        return this;
    }
    /**
     * Populate data object from backend query
     * @param data
     */
    populateFromBackend() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._populated === false) {
                if (this.path !== '/' && this.path !== '') {
                    yield Core_1.Core.getBackend(this._objectUri.backend).read(this);
                }
                this._populated = true;
                if (Reflect.get(this._properties, 'name')) {
                    this.uri.label = this.val('name');
                }
            }
            return this;
        });
    }
    isPopulated() {
        return this._populated;
    }
    isPersisted() {
        return this._persisted;
    }
    get properties() {
        return this._properties;
    }
    get backend() {
        return this._objectUri ? this._objectUri.backend : undefined;
    }
    get path() {
        return this._objectUri ? this._objectUri.path : '';
    }
    set uid(uid) {
        if (this._uid !== undefined) {
            throw new Error(`DataObject already has an uid`);
        }
        this._uid = uid;
    }
    get uid() {
        return this._objectUri ? this._objectUri.uid : undefined;
    }
    get data() {
        return this._properties;
    }
    set uri(uri) {
        this._objectUri = uri;
        if (this._objectUri.collection !== ObjectUri_1.ObjectUri.MISSING_COLLECTION) {
            this._persisted = true;
        }
    }
    get uri() {
        return this._objectUri;
    }
    get class() {
        // TODO get class type
        return this.uri.class;
    }
    has(key) {
        return Reflect.has(this._properties, key);
    }
    /**
     * Returns property matching key or throw
     * @param key string
     * @returns BaseProperty
     */
    get(key) {
        if (!Reflect.has(this._properties, key)) {
            throw new ResourcesErrors_1.NotFoundError(`No property matching key ${key}`);
        }
        return Reflect.get(this._properties, key);
    }
    set(key, val) {
        if (!this.has(key)) {
            throw new Error(`Unknown property in data object: ${key}`);
        }
        this._properties[key].set(val);
        this._populated = true;
        this._modified = true;
        return this;
    }
    /**
     * Get value of given property
     * @param key string
     * @returns any
     */
    val(key, transform = undefined) {
        if (this.has(key)) {
            return Reflect.get(this._properties, key).val(transform);
        }
        else {
            throw new Error(`Unknown property '${key}'`);
        }
    }
    toJSON(objectsAsReferences = false) {
        return Object.assign(Object.assign({}, (this.uri && { uid: this.uri.uid, path: this.uri.path })), this._dataToJSON(objectsAsReferences));
    }
    toReference() {
        return Object.assign(Object.assign({}, this._objectUri.toReference()), { label: this.val('name') || '' });
    }
    _dataToJSON(objectsAsReferences = false) {
        const data = {};
        Object.keys(this._properties).forEach((key) => {
            const prop = Reflect.get(this._properties, key);
            switch (prop.constructor.name) {
                case 'CollectionProperty':
                    // ignore
                    break;
                case 'ObjectProperty':
                    const value = prop.val();
                    Reflect.set(data, key, value
                        ? objectsAsReferences && !(value instanceof ObjectUri_1.ObjectUri)
                            ? value.asReference()
                            : value.toJSON
                                ? value.toJSON()
                                : value
                        : null);
                    break;
                case 'BooleanProperty':
                    Reflect.set(data, key, Boolean(prop.val()));
                    break;
                case 'ArrayProperty':
                    Reflect.set(data, key, prop.val() || []);
                    break;
                default:
                    Reflect.set(data, key, prop.val() || null);
            }
        });
        return data;
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Core_1.Core.getBackend().read(this); //this.populate()
            }
            catch (err) {
                console.log(err.message);
                throw new Error(err.message);
            }
        });
    }
    save() {
        const backend = Core_1.Core.getBackend(this.backend || Core_1.Core.defaultBackend);
        this._persisted = true;
        this._modified = false;
        return this.uid ? backend.update(this) : backend.create(this);
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const backend = Core_1.Core.getBackend(this.backend || Core_1.Core.defaultBackend);
            this._persisted = false;
            this._modified = false;
            return yield backend.delete(this);
        });
    }
    /**
     * Data object must be created from factory in order for async-loaded data to be available
     * @param className
     * @param param
     * @returns DataObject
     */
    static factory(param = undefined) {
        try {
            return new this(param);
        }
        catch (err) {
            console.log(err);
            throw new Error(`Unable to build data object: ${err.message}`);
        }
    }
    clone(data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const cloned = yield DataObject.factory();
            cloned.uri.class = this.uri.class;
            cloned._populated = false;
            for (let property of Object.keys(this._properties)) {
                cloned._properties[property] = this._properties[property].clone();
            }
            if (data) {
                yield cloned.populate(data);
            }
            return cloned;
        });
    }
}
exports.DataObject = DataObject;
