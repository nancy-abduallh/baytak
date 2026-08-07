import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request } from 'express';


export const ORDER_IMAGES_DIR = join(process.cwd(), 'uploads', 'orders');

export function ensureOrderImagesDirExists() {
    if (!existsSync(ORDER_IMAGES_DIR)) {
        mkdirSync(ORDER_IMAGES_DIR, { recursive: true });
    }
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ORDER_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per image
export const ORDER_IMAGE_MAX_COUNT = 5; // max photos per booking

export function orderImageFileFilter(
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

export const orderImageStorage = diskStorage({
    destination: (_req, _file, callback) => {
        ensureOrderImagesDirExists();
        callback(null, ORDER_IMAGES_DIR);
    },
    filename: (req, file, callback) => {
        const orderId = (req.params as { id?: string }).id ?? 'unknown';
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname).toLowerCase() || '.jpg';
        callback(null, `order-${orderId}-${uniqueSuffix}${ext}`);
    },
});