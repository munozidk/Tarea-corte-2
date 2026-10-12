import { NotFoundException } from '@nestjs/common';

/**
 * Excepción genérica para cualquier recurso que no existe (ejercicio, rutina, sesión...).
 */
export class ResourceNotFoundException extends NotFoundException {
    constructor(resource: string, id: number) {
        super({
            error: `${resource} Not Found`,
            message: `El recurso '${resource}' con identificador ${id} no fue encontrado.`,
        });
    }
}
