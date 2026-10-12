import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateRoutineDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la rutina es obligatorio' })
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    /**
     * Opcional. Solo quien tenga manage_all_records puede crear una rutina para otro usuario.
     * Si no se envía, la rutina queda a nombre del usuario autenticado.
     */
    @IsOptional()
    @IsInt()
    @Min(1)
    userId?: number;
}
