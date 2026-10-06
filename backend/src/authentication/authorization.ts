import type { Request, Response, NextFunction } from 'express';

import ApiError from '../helpers/apiError.js';
import { permissions } from '../config/permissionConfig.js';
import type {
  PermissionAction,
  PermissionModule,
} from '../types/permission.types.js';

const authorization = (module: PermissionModule, action: PermissionAction) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.role;
    if (!role) {
      throw new ApiError(401, 'Authentication required!');
    }

    const rolePermissions = permissions.find(p => p.role === role);
    if (!rolePermissions) {
      throw new ApiError(403, 'Role not found!');
    }

    if (rolePermissions.permissions[module]?.[action] !== true) {
      throw new ApiError(
        403,
        `You do not have permission to ${module} ${action}!`,
      );
    }
    next();
  };
};

export default authorization;
