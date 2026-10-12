import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateActivityExerciseDto } from './create-activity-exercise.dto';

// Se corrigen los valores reales; la sesión y el ejercicio planeado al que pertenece no cambian
export class UpdateActivityExerciseDto extends PartialType(
    OmitType(CreateActivityExerciseDto, ['activityLogId', 'routineExerciseId'] as const),
) {}
