"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
const BaseRepository_1 = __importDefault(require("./BaseRepository"));
const Entity_1 = require("./Entity");
class EntityRepository extends BaseRepository_1.default {
    constructor(backendAdapter = Core_1.Core.getBackend()) {
        super(Entity_1.Entity, backendAdapter);
    }
}
exports.default = EntityRepository;
