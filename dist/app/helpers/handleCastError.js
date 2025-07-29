"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: `Invalid MongoDB Object Id. Please provide a valid Object Id${err.message}`,
    };
};
exports.handleCastError = handleCastError;
