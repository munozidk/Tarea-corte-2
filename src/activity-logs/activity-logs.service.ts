import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceNotFoundException } from '../common/exceptions';
import { User } from '../auth/entities/user.entity';
import { UserService } from '../auth/user/user.service';
import { assertOwnership, canManageAll } from '../auth/utils/permissions.util';
import { RoutinesService } from '../routines/routines.service';

import { ActivityLog } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Injectable()
export class ActivityLogsService {
    constructor(
        @InjectRepository(ActivityLog)
        private readonly activityLogRepository: Repository<ActivityLog>,
        private readonly routinesService: RoutinesService,
        private readonly userService: UserService,
    ) {}

    async create(dto: CreateActivityLogDto, currentUser: User): Promise<ActivityLog> {
        const { routineId, userId, ...dates } = dto;

        let owner = currentUser;
        if (userId && userId !== currentUser.id) {
            if (!canManageAll(currentUser)) {
                throw new ForbiddenException('Acceso denegado: no puedes registrar sesiones de otro usuario');
            }
            owner = await this.userService.findOne(userId);
        }

        // 404 si no existe, 403 si la rutina es de otro y no eres admin
        const routine = await this.routinesService.findOne(routineId, currentUser);
        if (routine.user.id !== owner.id) {
            throw new BadRequestException('La rutina debe pertenecer al usuario dueño de la sesión');
        }
        this.validateDates(dates.startedAt, dates.completedAt);

        const log = this.activityLogRepository.create({ ...dates, user: owner, routine });
        const saved = await this.activityLogRepository.save(log);
        return this.findOne(saved.id, currentUser);
    }

    async findAll(currentUser: User): Promise<ActivityLog[]> {
        return await this.activityLogRepository.find({
            where: canManageAll(currentUser) ? {} : { user: { id: currentUser.id } },
            relations: { user: true, routine: true },
            order: { startedAt: 'DESC' },
        });
    }

    /** Detalle de una sesión con lo que realmente se hizo y el ejercicio base de cada registro. */
    async findOne(id: number, currentUser: User): Promise<ActivityLog> {
        const log = await this.activityLogRepository.findOne({
            where: { id },
            relations: {
                user: true,
                routine: true,
                activityExercises: { routineExercise: { exercise: true } },
            },
        });
        if (!log) {
            throw new ResourceNotFoundException('ActivityLog', id);
        }
        assertOwnership(currentUser, log.user.id, 'sesión de entrenamiento');
        return log;
    }

    async update(id: number, dto: UpdateActivityLogDto, currentUser: User): Promise<ActivityLog> {
        const log = await this.findOne(id, currentUser);
        this.validateDates(dto.startedAt ?? log.startedAt, dto.completedAt ?? log.completedAt);
        if (Object.keys(dto).length > 0) {
            await this.activityLogRepository.update(log.id, dto);
        }
        return this.findOne(id, currentUser);
    }

    async remove(id: number, currentUser: User): Promise<{ id: number }> {
        const log = await this.findOne(id, currentUser);
        await this.activityLogRepository.delete(log.id);
        return { id };
    }

    private validateDates(startedAt?: Date | null, completedAt?: Date | null) {
        if (startedAt && completedAt && completedAt < startedAt) {
            throw new BadRequestException('completedAt no puede ser anterior a startedAt');
        }
    }
}
