import { ForbiddenException } from '@nestjs/common';

import { PermissionName, PERMISSIONS } from '../constants/permissions.constant';
import { User } from '../entities/user.entity';

/** Devuelve los nombres de permisos del rol del usuario. */
export function getUserPermissions(user: User): string[] {
    return user.role?.rolePermissions?.map((rp) => rp.permission.name) ?? [];
}

export function hasPermission(user: User, permission: PermissionName): boolean {
    return getUserPermissions(user).includes(permission);
}

/** true si el usuario puede ver/modificar registros de otros usuarios (por defecto: admin). */
export function canManageAll(user: User): boolean {
    return hasPermission(user, PERMISSIONS.MANAGE_ALL_RECORDS);
}

/**
 * Regla de propiedad: un usuario solo puede operar sobre lo suyo,
 * salvo que tenga el permiso manage_all_records.
 */
export function assertOwnership(user: User, ownerId: number, resource: string): void {
    if (ownerId !== user.id && !canManageAll(user)) {
        throw new ForbiddenException(`Acceso denegado: este recurso (${resource}) pertenece a otro usuario`);
    }
}
