import { SetMetadata } from '@nestjs/common';
import { AdminPermission } from '../permissions.constants';

export const PERMISSIONS_KEY = 'requiredPermissions';

// Attach one or more required permissions to a route. `super_admin`
// always passes (see PermissionsGuard); every other admin needs at
// least one of the listed permissions in their `permissions` array.
export const RequirePermission = (...permissions: AdminPermission[]) => SetMetadata(PERMISSIONS_KEY, permissions);
