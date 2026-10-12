import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PERMISSIONS } from '../auth/constants/permissions.constant';
import { User } from '../auth/entities/user.entity';
import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';

import { ActivityExercisesService } from './activity-exercises.service';
import { CreateActivityExerciseDto } from './dto/create-activity-exercise.dto';
import { UpdateActivityExerciseDto } from './dto/update-activity-exercise.dto';

@Controller('activity-exercises')
export class ActivityExercisesController {
    constructor(private readonly activityExercisesService: ActivityExercisesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(PERMISSIONS.CREATE_ACTIVITY_EXERCISE)
    create(@Body() dto: CreateActivityExerciseDto, @CurrentUser() user: User) {
        return this.activityExercisesService.create(dto, user);
    }

    @Get()
    @Auth(PERMISSIONS.READ_ACTIVITY_EXERCISE)
    findAll(
        @CurrentUser() user: User,
        @Query('activityLogId', new ParseIntPipe({ optional: true })) activityLogId?: number,
    ) {
        return this.activityExercisesService.findAll(user, activityLogId);
    }

    @Get(':id')
    @Auth(PERMISSIONS.READ_ACTIVITY_EXERCISE)
    findOne(@Param('id', PositiveIntPipe) id: number, @CurrentUser() user: User) {
        return this.activityExercisesService.findOne(id, user);
    }

    @Patch(':id')
    @Auth(PERMISSIONS.UPDATE_ACTIVITY_EXERCISE)
    update(
        @Param('id', PositiveIntPipe) id: number,
        @Body() dto: UpdateActivityExerciseDto,
        @CurrentUser() user: User,
    ) {
        return this.activityExercisesService.update(id, dto, user);
    }

    @Delete(':id')
    @Auth(PERMISSIONS.DELETE_ACTIVITY_EXERCISE)
    remove(@Param('id', PositiveIntPipe) id: number, @CurrentUser() user: User) {
        return this.activityExercisesService.remove(id, user);
    }
}
