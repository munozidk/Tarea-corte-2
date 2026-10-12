import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '../../decorators/permissions.decorator';
import { User } from '../../entities/user.entity';
import { getUserPermissions } from '../../utils/permissions.util';

interface AuthenticatedRequest {
    user?: User;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 1. Permisos exigidos: primero los del método; si no tiene, los de la clase (controlador)
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        // 2. Usuario que dejó AuthGuard('jwt') en la request
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('Usuario no autenticado en la solicitud');
        }

        // 3. Permisos que el usuario tiene a través de su rol (role -> role_permissions -> permission)
        const userPermissions = getUserPermissions(user);
        const missing = requiredPermissions.filter((permission) => !userPermissions.includes(permission));

        if (missing.length > 0) {
            throw new ForbiddenException(
                `Acceso denegado: No cuentas con los permisos suficientes para esta acción (${missing.join(', ')})`,
            );
        }
        return true;
    }
}
