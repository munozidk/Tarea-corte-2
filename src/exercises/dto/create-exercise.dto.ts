import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateExerciseDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' })
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsNotEmpty({ message: 'El tipo de ejercicio es obligatorio (strength, cardio, core...)' })
    @MaxLength(50)
    type: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    estimatedCalories?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    estimatedDistanceKm?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    estimatedDurationMin?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    icon?: string;
}
