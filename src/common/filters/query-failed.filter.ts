import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * Traduce errores de PostgreSQL a respuestas HTTP entendibles en lugar de un 500 genérico.
 *  - 23505 unique_violation       -> 409 (ej. nombre de rol o email repetido)
 *  - 23503 foreign_key_violation  -> 409 (ej. borrar un ejercicio usado en una rutina)
 */
@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
    catch(exception: QueryFailedError & { driverError?: { code?: string; detail?: string } }, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();
        const code = exception.driverError?.code;

        if (code === '23505' || code === '23503') {
            response.status(HttpStatus.CONFLICT).json({
                statusCode: HttpStatus.CONFLICT,
                error: 'Conflict',
                message:
                    code === '23505'
                        ? 'Ya existe un registro con ese valor único.'
                        : 'La operación viola una relación con otro registro (está en uso o no existe).',
                detail: exception.driverError?.detail,
            });
            return;
        }

        console.error(exception);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error interno al acceder a la base de datos',
        });
    }
}
