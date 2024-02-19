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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backends_1 = require("../backends");
const ResourcesErrors_1 = require("../common/ResourcesErrors");
const BaseRepository_1 = __importDefault(require("./BaseRepository"));
const User_1 = require("./User");
const UNAUTHORIZED_ERROR = `Wrong password or email`;
class UserRepository extends BaseRepository_1.default {
    constructor(backendAdapter) {
        super(User_1.User, backendAdapter);
    }
    getFromEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = new backends_1.Query(User_1.User);
            query.where('email', email).batch(1);
            const { items } = yield this.query(query);
            if (items.length == 0) {
                throw new ResourcesErrors_1.NotFoundError(`There is no user with email '${email}'`);
            }
            return items[0];
        });
    }
}
exports.default = UserRepository;
