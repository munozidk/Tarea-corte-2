import { PickType, PartialType } from '@nestjs/mapped-types';

import { CreateActivityLogDto } from './create-activity-log.dto';

// Solo se ajustan las fechas; el usuario y la rutina de una sesión no cambian
export class UpdateActivityLogDto extends PartialType(
    PickType(CreateActivityLogDto, ['startedAt', 'completedAt'] as const),
) {}
