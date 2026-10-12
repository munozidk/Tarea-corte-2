import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PermissionName } from '../constants/permissions.constant';
import { PermissionsGuard } from '../guards/permissions/permissions.guard';

import { Permissions } from './permissions.decorator';

/**
 * Decorador compuesto: en una sola línea protege un endpoint.
 *
 * 1. AuthGuard('jwt')  -> valida el token Bearer y carga el usuario (con rol y permisos) en request.user.
 *                         Sin token o con token inválido responde 401.
 * 2. PermissionsGuard  -> compara los permisos exigidos con los del rol del usuario.
 *                         Si falta alguno responde 403.
 *
 * Uso: @Auth(PERMISSIONS.READ_EXERCISE)
 */
export function Auth(...permissions: PermissionName[]) {
    return applyDecorators(Permissions(...permissions), UseGuards(AuthGuard('jwt'), PermissionsGuard));
}
