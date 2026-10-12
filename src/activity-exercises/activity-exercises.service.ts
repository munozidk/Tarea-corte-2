import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { ResourceNotFoundException } from '../common/exceptions';
import { User } from '../auth/entities/user.entity';
import { assertOwnership, canManageAll } from '../auth/utils/permissions.util';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { RoutineExercisesService } from '../routine-exercises/routine-exercises.service';

import { ActivityExercise } from './entities/activity-exercise.entity';
import { CreateActivityExerciseDto } from './dto/create-activity-exercise.dto';
import { UpdateActivityExerciseDto } from './dto/update-activity-exercise.dto';

@Injectable()
export class ActivityExercisesService {
    constructor(
        @InjectRepository(ActivityExercise)
        private readonly activityExerciseRepository: Repository<ActivityExercise>,
        private readonly activityLogsService: ActivityLogsService,
        private readonly routineExercisesService: RoutineExercisesService,
    ) {}

    async create(dto: CreateActivityExerciseDto, currentUser: User): Promise<ActivityExercise> {
        const { activityLogId, routineExerciseId, ...data } = dto;

        // Ambos findOne validan existencia (404) y propiedad (403)
        const activityLog = await this.activityLogsService.findOne(activityLogId, currentUser);
        const routineExercise = await this.routineExercisesService.findOne(routineExerciseId, currentUser);

        // Consistencia: el ejercicio planeado debe ser de la misma rutina que se está ejecutando
        if (!activityLog.routine || routineExercise.routine.id !== activityLog.routine.id) {
            throw new BadRequestException('El ejercicio planeado no pertenece a la rutina de esta sesión');
        }
        this.validateDates(data.startedAt, data.completedAt);

        const activityExercise = this.activityExerciseRepository.create({ ...data, activityLog, routineExercise });
        const saved = await this.activityExerciseRepository.save(activityExercise);
        return this.findOne(saved.id, currentUser);
    }

    /** Lista lo realizado; opcionalmente filtra por sesión (?activityLogId=1). */
    async findAll(currentUser: User, activityLogId?: number): Promise<ActivityExercise[]> {
        const where: FindOptionsWhere<ActivityExercise> = {};
        if (activityLogId) {
            where.activityLog = { id: activityLogId };
        }
        if (!canManageAll(currentUser)) {
            where.activityLog = { ...(where.activityLog as object), user: { id: currentUser.id } };
        }
        return await this.activityExerciseRepository.find({
            where,
            relations: { activityLog: true, routineExercise: { exercise: true } },
            order: { activityLog: { id: 'ASC' }, id: 'ASC' },
        });
    }

    async findOne(id: number, currentUser: User): Promise<ActivityExercise> {
        const activityExercise = await this.activityExerciseRepository.findOne({
            where: { id },
            relations: { activityLog: { user: true }, routineExercise: { exercise: true } },
        });
        if (!activityExercise) {
            throw new ResourceNotFoundException('ActivityExercise', id);
        }
        assertOwnership(currentUser, activityExercise.activityLog.user.id, 'ejercicio realizado');
        return activityExercise;
    }

    async update(id: number, dto: UpdateActivityExerciseDto, currentUser: User): Promise<ActivityExercise> {
        const activityExercise = await this.findOne(id, currentUser);
        this.validateDates(
            dto.startedAt ?? activityExercise.startedAt,
            dto.completedAt ?? activityExercise.completedAt,
        );
        if (Object.keys(dto).length > 0) {
            await this.activityExerciseRepository.update(activityExercise.id, dto);
        }
        return this.findOne(id, currentUser);
    }

    async remove(id: number, currentUser: User): Promise<{ id: number }> {
        const activityExercise = await this.findOne(id, currentUser);
        await this.activityExerciseRepository.delete(activityExercise.id);
        return { id };
    }

    private validateDates(startedAt?: Date | null, completedAt?: Date | null) {
        if (startedAt && completedAt && completedAt < startedAt) {
            throw new BadRequestException('completedAt no puede ser anterior a startedAt');
        }
    }
}
