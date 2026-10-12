import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateRoutineExerciseDto } from './create-routine-exercise.dto';

// Un ejercicio planeado no se mueve a otra rutina; se borra y se crea en la otra
export class UpdateRoutineExerciseDto extends PartialType(OmitType(CreateRoutineExerciseDto, ['routineId'] as const)) {}
