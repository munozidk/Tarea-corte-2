import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoutinesModule } from '../routines/routines.module';
import { ExercisesModule } from '../exercises/exercises.module';

import { RoutineExercise } from './entities/routine-exercise.entity';
import { RoutineExercisesService } from './routine-exercises.service';
import { RoutineExercisesController } from './routine-exercises.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RoutineExercise]), RoutinesModule, ExercisesModule],
    controllers: [RoutineExercisesController],
    providers: [RoutineExercisesService],
    exports: [RoutineExercisesService],
})
export class RoutineExercisesModule {}
