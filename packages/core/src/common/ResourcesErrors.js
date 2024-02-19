"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoneError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.ResourceError = void 0;
class ResourceError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.ResourceError = ResourceError;
class BadRequestError extends ResourceError {
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends ResourceError {
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ResourceError {
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends ResourceError {
}
exports.NotFoundError = NotFoundError;
class GoneError extends ResourceError {
}
exports.GoneError = GoneError;
