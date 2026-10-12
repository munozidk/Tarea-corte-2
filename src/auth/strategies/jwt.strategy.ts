import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../user/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private readonly usersService: UserService,
    ) {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('La variable de entorno JWT_SECRET no est� configurada');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: JwtPayload) {
        // Se recarga el usuario desde BD con rol y permisos: si un admin le cambia el rol,
        // el cambio aplica en la siguiente petición sin esperar a que expire el token.
        // findOne lanza 404 si el usuario fue borrado; aquí lo convertimos en 401 (token inválido).
        const user = await this.usersService.findOne(payload.sub, true).catch(() => null);
        if (!user) {
            throw new UnauthorizedException('El token no corresponde a un usuario activo');
        }
        return user;
    }
}
