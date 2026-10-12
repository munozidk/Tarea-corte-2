import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../entities/user.entity';

/**
 * Inyecta en el parámetro del controlador el usuario autenticado
 * (el que JwtStrategy.validate() dejó en request.user).
 *
 * Uso: findAll(@CurrentUser() user: User)
 */
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    return request.user;
});
