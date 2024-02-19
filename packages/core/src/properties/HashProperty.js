"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashProperty = void 0;
const StringProperty_1 = require("./StringProperty");
class HashProperty extends StringProperty_1.StringProperty {
    constructor(config) {
        super(config);
        this._salt = '';
        this._prefixed = false;
        this._algorithm = config.algorithm || HashProperty.ALGORITHM_MD5;
        this._salt = config.salt || '';
        this._prefixed = config.prefixed || false;
    }
    _hash(value) {
        const crypto = require('crypto');
        let algo;
        switch (this._algorithm) {
            case HashProperty.ALGORITHM_MD5:
                algo = crypto.createHash('md5');
                break;
            case HashProperty.ALGORITHM_SHA1:
                algo = crypto.createHash('sha1');
                break;
            case HashProperty.ALGORITHM_SHA256:
                algo = crypto.createHash('sha256');
                break;
            case HashProperty.ALGORITHM_BCRYPT:
                break;
            default:
                throw new Error(`Insupported or missing hash algorithm`);
        }
        let hash = this._prefixed ? `${this._algorithm}-` : '';
        hash += algo.update(`${this._salt}${value}`).digest('hex');
        this._rawValue = false; // don't test some constraints after hashing
        return hash;
    }
    /**
     * Never return the password which is hashed anyway
     * @param transform
     * @returns
     */
    get(transform) {
        return;
    }
    set(value) {
        return super.set(this._hash(value));
    }
    compare(value) {
        return this._hash(value) === this._value;
    }
}
exports.HashProperty = HashProperty;
HashProperty.TYPE = 'hash';
HashProperty.ALGORITHM_MD5 = 'md5';
HashProperty.ALGORITHM_SHA1 = 'sha1';
HashProperty.ALGORITHM_SHA256 = 'sha256';
HashProperty.ALGORITHM_BCRYPT = 'bcrypt';
