"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Core_1 = require("../Core");
const statuses = __importStar(require("../statuses"));
const ResourcesErrors_1 = require("../common/ResourcesErrors");
const DataObject_1 = require("./DataObject");
const RESOURCE_GONE_ERROR = `The resource you are trying to access has been deleted.`;
/**
 * CRUD methods for models/entities inheriting from BaseObject
 * Extend this by passing the typeof of the desired class to the constructor
 */
class BaseRepository {
    constructor(model, backendAdapter = Core_1.Core.getBackend()) {
        this._model = model;
        this.backendAdapter = backendAdapter;
    }
    getDataObjectFromUid(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._model.COLLECTION || this._model.name.toLowerCase();
            const path = `${collection}/${uid}`;
            const dataObject = DataObject_1.DataObject.factory({
                properties: this._model.PROPS_DEFINITION,
                uri: path,
            });
            dataObject.uid = uid;
            return dataObject;
        });
    }
    create(obj, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedObj = yield this.backendAdapter.create(obj.dataObject, uid);
            return this._model.fromDataObject(savedObj); //as Persisted<T>
        });
    }
    read(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = key.indexOf('/') !== -1 ? key.substring(key.lastIndexOf('/') + 1) : key;
            try {
                const dataObject = yield this.getDataObjectFromUid(uid);
                const response = yield this.backendAdapter.read(dataObject);
                const obj = this._model.fromDataObject(response);
                // TODO should be moved to the backend middleware
                if (obj.status === statuses.DELETED) {
                    throw new ResourcesErrors_1.GoneError(RESOURCE_GONE_ERROR);
                }
                return obj;
            }
            catch (e) {
                if (e instanceof ResourcesErrors_1.GoneError) {
                    throw e;
                }
                if (e instanceof ResourcesErrors_1.NotFoundError) {
                    throw new ResourcesErrors_1.NotFoundError('[Repository] ' + e.message);
                }
                throw e;
            }
        });
    }
    update(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataObject = obj.dataObject;
            const savedObj = yield this.backendAdapter.update(dataObject);
            return this._model.fromDataObject(savedObj);
        });
    }
    /**
     * delete object in its backend
     * @param uid string
     */
    delete(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataObject = yield this.getDataObjectFromUid(uid);
            return yield this.backendAdapter.delete(dataObject);
        });
    }
    query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield query.fetchAsInstances(this.backendAdapter);
        });
    }
}
exports.default = BaseRepository;
