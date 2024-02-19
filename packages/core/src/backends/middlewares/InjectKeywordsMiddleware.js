"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectKeywordsMiddleware = void 0;
const Backend_1 = require("../../Backend");
const properties_1 = require("../../properties");
class InjectKeywordsMiddleware {
    execute(dataObject, action) {
        if (!dataObject.has('keywords')) {
            dataObject.addProperty(new properties_1.ArrayProperty({ name: 'keywords' }));
        }
        switch (action) {
            case Backend_1.BackendAction.CREATE:
            case Backend_1.BackendAction.UPDATE:
                dataObject.set('keywords', this._createKeywords(dataObject));
                break;
            default:
                break;
        }
        return;
    }
    _createKeywords(dataObject) {
        const keywords = [];
        Object.keys(dataObject.properties)
            .filter((key) => dataObject.get(key).fullSearch === true)
            .forEach((key) => {
            const val = dataObject.val(key);
            if (val) {
                val.toLowerCase()
                    .split(' ')
                    .forEach((word) => {
                    let seq = '';
                    word
                        .split('')
                        .splice(0, 15)
                        .forEach((letter) => {
                        seq += letter;
                        if (seq.length > 1) {
                            keywords.push(seq);
                        }
                    });
                });
            }
        });
        return [...new Set(keywords)];
    }
}
exports.InjectKeywordsMiddleware = InjectKeywordsMiddleware;
