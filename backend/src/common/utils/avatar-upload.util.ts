import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request } from 'express';

// All technician avatars live under backend/uploads/avatars and are served
// statically at /uploads/avatars/<filename> (see main.ts -> useStaticAssets).
export const AVATARS_DIR = join(process.cwd(), 'uploads', 'avatars');

export function ensureAvatarsDirExists() {
    if (!existsSync(AVATARS_DIR)) {
        mkdirSync(AVATARS_DIR, { recursive: true });
    }
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function avatarImageFileFilter(
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        callback(new BadRequestException('صيغة الصورة غير مدعومة (JPG, PNG أو WEBP فقط)'), false);
        return;
    }
    callback(null, true);
}

export const technicianAvatarStorage = diskStorage({
    destination: (_req, _file, callback) => {
        ensureAvatarsDirExists();
        callback(null, AVATARS_DIR);
    },
    filename: (req, file, callback) => {
        const technicianId = (req.params as { id?: string }).id ?? 'unknown';
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname).toLowerCase() || '.jpg';
        callback(null, `technician-${technicianId}-${uniqueSuffix}${ext}`);
    },
});