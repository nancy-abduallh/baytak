"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderImageStorage = exports.ORDER_IMAGE_MAX_COUNT = exports.ORDER_IMAGE_MAX_SIZE_BYTES = exports.ORDER_IMAGES_DIR = void 0;
exports.ensureOrderImagesDirExists = ensureOrderImagesDirExists;
exports.orderImageFileFilter = orderImageFileFilter;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
exports.ORDER_IMAGES_DIR = (0, path_1.join)(process.cwd(), 'uploads', 'orders');
function ensureOrderImagesDirExists() {
    if (!(0, fs_1.existsSync)(exports.ORDER_IMAGES_DIR)) {
        (0, fs_1.mkdirSync)(exports.ORDER_IMAGES_DIR, { recursive: true });
    }
}
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
exports.ORDER_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
exports.ORDER_IMAGE_MAX_COUNT = 5;
function orderImageFileFilter(_req, file, callback) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        callback(new common_1.BadRequestException('صيغة الصورة غير مدعومة (JPG, PNG أو WEBP فقط)'), false);
        return;
    }
    callback(null, true);
}
exports.orderImageStorage = (0, multer_1.diskStorage)({
    destination: (_req, _file, callback) => {
        ensureOrderImagesDirExists();
        callback(null, exports.ORDER_IMAGES_DIR);
    },
    filename: (req, file, callback) => {
        const orderId = req.params.id ?? 'unknown';
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = (0, path_1.extname)(file.originalname).toLowerCase() || '.jpg';
        callback(null, `order-${orderId}-${uniqueSuffix}${ext}`);
    },
});
//# sourceMappingURL=order-image-upload.util.js.map