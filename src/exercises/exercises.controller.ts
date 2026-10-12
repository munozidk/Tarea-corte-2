import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { PERMISSIONS } from '../auth/constants/permissions.constant';
import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';

import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(PERMISSIONS.CREATE_EXERCISE)
    create(@Body() createExerciseDto: CreateExerciseDto) {
        return this.exercisesService.create(createExerciseDto);
    }

    @Get()
    @Auth(PERMISSIONS.READ_EXERCISE)
    findAll() {
        return this.exercisesService.findAll();
    }

    @Get(':id')
    @Auth(PERMISSIONS.READ_EXERCISE)
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.exercisesService.findOne(id);
    }

    @Patch(':id')
    @Auth(PERMISSIONS.UPDATE_EXERCISE)
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateExerciseDto: UpdateExerciseDto) {
        return this.exercisesService.update(id, updateExerciseDto);
    }

    @Delete(':id')
    @Auth(PERMISSIONS.DELETE_EXERCISE)
    remove(@Param('id', PositiveIntPipe) id: number) {
        return this.exercisesService.remove(id);
    }
}
