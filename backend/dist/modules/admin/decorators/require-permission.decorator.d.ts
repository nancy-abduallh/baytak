import { AdminPermission } from '../permissions.constants';
export declare const PERMISSIONS_KEY = "requiredPermissions";
export declare const RequirePermission: (...permissions: AdminPermission[]) => import("@nestjs/common").CustomDecorator<string>;
