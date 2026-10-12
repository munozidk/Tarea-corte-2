import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { RoutineExercisesModule } from '../routine-exercises/routine-exercises.module';

import { ActivityExercise } from './entities/activity-exercise.entity';
import { ActivityExercisesService } from './activity-exercises.service';
import { ActivityExercisesController } from './activity-exercises.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityExercise]), ActivityLogsModule, RoutineExercisesModule],
    controllers: [ActivityExercisesController],
    providers: [ActivityExercisesService],
})
export class ActivityExercisesModule {}
