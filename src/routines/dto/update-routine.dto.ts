import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateRoutineDto } from './create-routine.dto';

// El dueño de una rutina no se cambia al actualizar
export class UpdateRoutineDto extends PartialType(OmitType(CreateRoutineDto, ['userId'] as const)) {}
