import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Min } from 'class-validator';

export class CreateActivityLogDto {
    @IsInt({ message: 'routineId debe ser un entero' })
    @Min(1)
    routineId!: number;

    /** Si no se envía, la sesión inicia "ahora". Formato ISO: 2026-10-08T07:00:00Z */
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'startedAt debe ser una fecha válida (ISO 8601)' })
    startedAt?: Date;

    /** Se envía al terminar la sesión; null/ausente = sesión en curso */
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'completedAt debe ser una fecha válida (ISO 8601)' })
    completedAt?: Date;

    /** Opcional. Solo con manage_all_records se puede registrar una sesión de otro usuario. */
    @IsOptional()
    @IsInt()
    @Min(1)
    userId?: number;
}
