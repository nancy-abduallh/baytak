import type { Request } from 'express';
export declare const ORDER_IMAGES_DIR: string;
export declare function ensureOrderImagesDirExists(): void;
export declare const ORDER_IMAGE_MAX_SIZE_BYTES: number;
export declare const ORDER_IMAGE_MAX_COUNT = 5;
export declare function orderImageFileFilter(_req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void): void;
export declare const orderImageStorage: import("multer").StorageEngine;
