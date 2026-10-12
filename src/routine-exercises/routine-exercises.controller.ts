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

import { RoutineExercisesService } from './routine-exercises.service';
import { CreateRoutineExerciseDto } from './dto/create-routine-exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine-exercise.dto';

@Controller('routine-exercises')
export class RoutineExercisesController {
    constructor(private readonly routineExercisesService: RoutineExercisesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(PERMISSIONS.CREATE_ROUTINE_EXERCISE)
    create(@Body() dto: CreateRoutineExerciseDto, @CurrentUser() user: User) {
        return this.routineExercisesService.create(dto, user);
    }

    @Get()
    @Auth(PERMISSIONS.READ_ROUTINE_EXERCISE)
    findAll(@CurrentUser() user: User, @Query('routineId', new ParseIntPipe({ optional: true })) routineId?: number) {
        return this.routineExercisesService.findAll(user, routineId);
    }

    @Get(':id')
    @Auth(PERMISSIONS.READ_ROUTINE_EXERCISE)
    findOne(@Param('id', PositiveIntPipe) id: number, @CurrentUser() user: User) {
        return this.routineExercisesService.findOne(id, user);
    }

    @Patch(':id')
    @Auth(PERMISSIONS.UPDATE_ROUTINE_EXERCISE)
    update(@Param('id', PositiveIntPipe) id: number, @Body() dto: UpdateRoutineExerciseDto, @CurrentUser() user: User) {
        return this.routineExercisesService.update(id, dto, user);
    }

    @Delete(':id')
    @Auth(PERMISSIONS.DELETE_ROUTINE_EXERCISE)
    remove(@Param('id', PositiveIntPipe) id: number, @CurrentUser() user: User) {
        return this.routineExercisesService.remove(id, user);
    }
}
