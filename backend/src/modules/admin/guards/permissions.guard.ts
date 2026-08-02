import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';
import { AdminPermission } from '../permissions.constants';
import { AdminTokenPayload } from '../strategies/jwt-admin.strategy';

// Runs AFTER JwtAdminGuard (which populates request.user from the JWT).
// A route with no @RequirePermission(...) is left open to any
// authenticated admin — only routes that opt in are restricted.
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<AdminPermission[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!required || required.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user: AdminTokenPayload & { permissions?: AdminPermission[] } = request.user;

        if (!user) throw new ForbiddenException('غير مصرح لك بالوصول لهذا المورد');

        // super_admin implicitly has every permission.
        if (user.role === 'super_admin') return true;

        const granted = new Set(user.permissions ?? []);
        const allowed = required.some((perm) => granted.has(perm));

        if (!allowed) {
            throw new ForbiddenException('لا تملك الصلاحية اللازمة لتنفيذ هذا الإجراء');
        }

        return true;
    }
}
