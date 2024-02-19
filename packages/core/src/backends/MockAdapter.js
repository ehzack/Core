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
exports.MockAdapter = void 0;
const Core_1 = require("../Core");
const ObjectUri_1 = require("../components/ObjectUri");
const faker_1 = require("@faker-js/faker");
const BackendError_1 = require("./BackendError");
const ResourcesErrors_1 = require("../common/ResourcesErrors");
const AbstractAdapter_1 = require("./AbstractAdapter");
class MockAdapter extends AbstractAdapter_1.AbstractAdapter {
    /**
     * Inject fixtures data to backend adapter
     * @param data BackendRecordType
     */
    static inject(data) {
        if (data.path) {
            MockAdapter._fixtures[data.path] = this.dao2backend(data);
        }
        else {
            throw new Error(`Can't inject data without a path`);
        }
    }
    static dao2backend(data) {
        const processed = {};
        Object.keys(data).forEach((key) => {
            if (data[key] !== null &&
                typeof data[key] === 'object' &&
                data[key].name === 'BaseObject') {
                processed[key] = data[key].dataObject.uri.toReference();
            }
            else {
                processed[key] = data[key];
            }
        });
        return processed;
    }
    static getFixtures() {
        return MockAdapter._fixtures;
    }
    static getFixture(key) {
        return MockAdapter._fixtures[key];
    }
    create(dataObject) {
        const uri = `${this.getCollection(dataObject)}/${faker_1.faker.random.alphaNumeric(12)}`;
        dataObject.uri = new ObjectUri_1.ObjectUri(uri);
        return new Promise((resolve, reject) => {
            try {
                MockAdapter.inject(Object.assign(Object.assign({}, dataObject.toJSON()), { uid: uri, path: uri }));
                resolve(dataObject);
            }
            catch (err) {
                reject(new BackendError_1.BackendError(err.message));
            }
        });
    }
    read(dataObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const path = dataObject.path;
                const data = MockAdapter._fixtures[path];
                if (data === undefined) {
                    reject(new ResourcesErrors_1.NotFoundError(`[Mock] No data for ${path}`));
                    return;
                }
                this.log(`[DAO] Populating ${dataObject.path}`);
                resolve(yield dataObject.populate(data));
            }));
        });
    }
    update(dataObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const path = dataObject.path;
                const data = MockAdapter._fixtures[path];
                if (data === undefined) {
                    reject(new ResourcesErrors_1.NotFoundError(`[Mock] No data for ${path}`));
                }
                this.log(`[DAO] Updating ${dataObject.path}`);
                MockAdapter._fixtures[path] = Object.assign(Object.assign({}, data), dataObject.toJSON());
                resolve(dataObject);
            }));
        });
    }
    delete(dataObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const path = dataObject.path;
                const data = MockAdapter._fixtures[path];
                if (data === undefined) {
                    reject(new ResourcesErrors_1.NotFoundError(`[Mock] No data for ${path}`));
                }
                delete MockAdapter._fixtures[dataObject.path];
                dataObject.uri = new ObjectUri_1.ObjectUri();
                resolve(dataObject);
            });
        });
    }
    deleteCollection(collection, batchSize) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let key in MockAdapter._fixtures) {
                if (key.startsWith(`${collection}/`)) {
                    delete MockAdapter._fixtures[key];
                }
            }
            return new Promise(() => null);
        });
    }
    find(dataObject, filters = undefined, pagination = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = (pagination === null || pagination === void 0 ? void 0 : pagination.limits.batch) || 1e10;
            let items = [];
            const collection = this.getCollection(dataObject);
            // TODO filter only records matchinf collection
            for (let key in MockAdapter.getFixtures()) {
                let keep = true;
                if (key.startsWith(`${collection}/`) && items.length <= limit) {
                    const dao = yield dataObject.clone(MockAdapter.getFixture(key));
                    if (filters) {
                        if (Array.isArray(filters)) {
                            filters.forEach((filter) => {
                                const prop = dao.get(filter.prop);
                                if (typeof prop === 'undefined') {
                                    keep = false;
                                    return;
                                }
                                const val = prop.val();
                                if (typeof prop === 'object') {
                                    if (prop.constructor.name === 'ObjectProperty') {
                                        if (filter.value instanceof ObjectUri_1.ObjectUri &&
                                            val &&
                                            val.ref !== filter.value.path) {
                                            keep = false;
                                            return;
                                        }
                                    }
                                    else if (prop.constructor.name === 'CollectionProperty') {
                                        if (filter.value instanceof ObjectUri_1.ObjectUri &&
                                            prop.val() !== filter.value.path) {
                                            keep = false;
                                            return;
                                        }
                                    }
                                    else if (val !== filter.value) {
                                        keep = false;
                                        return;
                                    }
                                }
                                else {
                                    if (prop.val() !== filter.value) {
                                        keep = false;
                                        return;
                                    }
                                }
                            });
                        }
                    }
                    if (keep) {
                        dao.uri = new ObjectUri_1.ObjectUri(key);
                        items.push(dao);
                    }
                }
            }
            if (pagination && pagination.sortings.length > 0) {
                items = items.sort((a, b) => Number(a.val(pagination.sortings[0].prop) >
                    b.val(pagination.sortings[0].prop)));
            }
            return {
                items,
                meta: {
                    count: 100,
                    offset: (pagination === null || pagination === void 0 ? void 0 : pagination.limits.offset) || 0,
                    batch: (pagination === null || pagination === void 0 ? void 0 : pagination.limits.batch) || 10,
                    executionTime: Core_1.Core.timestamp(),
                },
            };
        });
    }
}
exports.MockAdapter = MockAdapter;
MockAdapter._fixtures = {};
