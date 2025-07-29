"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateKeyError = void 0;
const handleDuplicateKeyError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists`,
    };
};
exports.handleDuplicateKeyError = handleDuplicateKeyError;
