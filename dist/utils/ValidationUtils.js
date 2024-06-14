"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
}
exports.ValidationError = ValidationError;
class ValidationUtils {
    static notEmpty(obj, message) {
        if (!obj) {
            throw new ValidationError(message);
        }
    }
    static isTrue(predicate, message) {
        if (!predicate) {
            throw new ValidationError(message);
        }
    }
    static allRequired(v) {
        Object.keys(v).forEach(k => {
            ValidationUtils.isTrue(!!v[k], `"${k}" must be provided`);
        });
    }
}
exports.ValidationUtils = ValidationUtils;
function panick(msg) {
    throw new Error(msg);
}
exports.panick = panick;
//# sourceMappingURL=ValidationUtils.js.map