"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.technicianAvatarStorage = exports.AVATAR_MAX_SIZE_BYTES = exports.AVATARS_DIR = void 0;
exports.ensureAvatarsDirExists = ensureAvatarsDirExists;
exports.avatarImageFileFilter = avatarImageFileFilter;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
exports.AVATARS_DIR = (0, path_1.join)(process.cwd(), 'uploads', 'avatars');
function ensureAvatarsDirExists() {
    if (!(0, fs_1.existsSync)(exports.AVATARS_DIR)) {
        (0, fs_1.mkdirSync)(exports.AVATARS_DIR, { recursive: true });
    }
}
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
exports.AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024;
function avatarImageFileFilter(_req, file, callback) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        callback(new common_1.BadRequestException('صيغة الصورة غير مدعومة (JPG, PNG أو WEBP فقط)'), false);
        return;
    }
    callback(null, true);
}
exports.technicianAvatarStorage = (0, multer_1.diskStorage)({
    destination: (_req, _file, callback) => {
        ensureAvatarsDirExists();
        callback(null, exports.AVATARS_DIR);
    },
    filename: (req, file, callback) => {
        const technicianId = req.params.id ?? 'unknown';
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = (0, path_1.extname)(file.originalname).toLowerCase() || '.jpg';
        callback(null, `technician-${technicianId}-${uniqueSuffix}${ext}`);
    },
});
//# sourceMappingURL=avatar-upload.util.js.map