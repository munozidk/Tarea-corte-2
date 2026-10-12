import { SetMetadata } from '@nestjs/common';

import { PermissionName } from '../constants/permissions.constant';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Guarda en la metadata del método (o de la clase) la lista de permisos que exige.
 * El PermissionsGuard lee esa metadata para decidir si deja pasar la petición.
 */
export const Permissions = (...permissions: PermissionName[]) => SetMetadata(PERMISSIONS_KEY, permissions);
