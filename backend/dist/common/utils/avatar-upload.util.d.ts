import type { Request } from 'express';
export declare const AVATARS_DIR: string;
export declare function ensureAvatarsDirExists(): void;
export declare const AVATAR_MAX_SIZE_BYTES: number;
export declare function avatarImageFileFilter(_req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void): void;
export declare const technicianAvatarStorage: import("multer").StorageEngine;
