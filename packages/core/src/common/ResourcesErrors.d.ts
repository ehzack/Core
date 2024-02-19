export declare class ResourceError extends Error {
    constructor(message: string);
}
export declare class BadRequestError extends ResourceError {
}
export declare class UnauthorizedError extends ResourceError {
}
export declare class ForbiddenError extends ResourceError {
}
export declare class NotFoundError extends ResourceError {
}
export declare class GoneError extends ResourceError {
}
