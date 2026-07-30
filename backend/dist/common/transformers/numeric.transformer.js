"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalTransformer = exports.bigintTransformer = void 0;
exports.bigintTransformer = {
    to: (value) => value,
    from: (value) => (value === null || value === undefined ? value : parseInt(value, 10)),
};
exports.decimalTransformer = {
    to: (value) => value,
    from: (value) => (value === null || value === undefined ? value : parseFloat(value)),
};
//# sourceMappingURL=numeric.transformer.js.map