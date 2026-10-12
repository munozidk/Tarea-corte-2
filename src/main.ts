import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { QueryFailedFilter } from './common/filters/query-failed.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Remueve propiedades que no estén en el DTO
            forbidNonWhitelisted: true, // Lanza error si se envían propiedades no reconocidas
            transform: true, // Transforma automáticamente los payloads a instancias de sus DTOs
        }),
    );

    // Aplica los decoradores de class-transformer (ej. @Exclude en passwordHash) a cada respuesta
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // Convierte errores de BD (duplicados, llaves foráneas) en 409 en lugar de 500
    app.useGlobalFilters(new QueryFailedFilter());

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
});
