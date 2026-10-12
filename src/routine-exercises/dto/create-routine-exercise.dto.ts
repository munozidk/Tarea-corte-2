import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRoutineExerciseDto {
    @IsInt({ message: 'routineId debe ser un entero' })
    @Min(1)
    routineId: number;

    @IsInt({ message: 'exerciseId debe ser un entero' })
    @Min(1)
    exerciseId: number;

    @IsInt()
    @Min(1, { message: 'orderIndex inicia en 1' })
    orderIndex: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    targetSets?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    targetReps?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    targetWeightKg?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    targetDurationMin?: number;
}
