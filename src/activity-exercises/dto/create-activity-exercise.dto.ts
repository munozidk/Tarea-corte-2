import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateActivityExerciseDto {
    @IsInt({ message: 'activityLogId debe ser un entero' })
    @Min(1)
    activityLogId!: number;

    @IsInt({ message: 'routineExerciseId debe ser un entero' })
    @Min(1)
    routineExerciseId!: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    actualSets?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    actualReps?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    actualWeightKg?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    actualDurationMin?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    caloriesBurned?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    distanceCoveredKm?: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'startedAt debe ser una fecha válida (ISO 8601)' })
    startedAt?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'completedAt debe ser una fecha válida (ISO 8601)' })
    completedAt?: Date;
}
