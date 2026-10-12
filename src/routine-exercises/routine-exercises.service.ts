import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { ResourceNotFoundException } from '../common/exceptions';
import { User } from '../auth/entities/user.entity';
import { assertOwnership, canManageAll } from '../auth/utils/permissions.util';
import { RoutinesService } from '../routines/routines.service';
import { ExercisesService } from '../exercises/exercises.service';

import { RoutineExercise } from './entities/routine-exercise.entity';
import { CreateRoutineExerciseDto } from './dto/create-routine-exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine-exercise.dto';

@Injectable()
export class RoutineExercisesService {
    constructor(
        @InjectRepository(RoutineExercise)
        private readonly routineExerciseRepository: Repository<RoutineExercise>,
        private readonly routinesService: RoutinesService,
        private readonly exercisesService: ExercisesService,
    ) {}

    async create(dto: CreateRoutineExerciseDto, currentUser: User): Promise<RoutineExercise> {
        const { routineId, exerciseId, ...data } = dto;
        // Valida que la rutina exista (404) y que sea del usuario (403)
        const routine = await this.routinesService.findOne(routineId, currentUser);
        const exercise = await this.exercisesService.findOne(exerciseId);

        const routineExercise = this.routineExerciseRepository.create({ ...data, routine, exercise });
        const saved = await this.routineExerciseRepository.save(routineExercise);
        return this.findOne(saved.id, currentUser);
    }

    /** Lista los ejercicios planeados; opcionalmente filtra por rutina (?routineId=1). */
    async findAll(currentUser: User, routineId?: number): Promise<RoutineExercise[]> {
        const where: FindOptionsWhere<RoutineExercise> = {};
        if (routineId) {
            where.routine = { id: routineId };
        }
        if (!canManageAll(currentUser)) {
            where.routine = { ...(where.routine as object), user: { id: currentUser.id } };
        }
        return await this.routineExerciseRepository.find({
            where,
            relations: { routine: true, exercise: true },
            order: { routine: { id: 'ASC' }, orderIndex: 'ASC' },
        });
    }

    async findOne(id: number, currentUser: User): Promise<RoutineExercise> {
        const routineExercise = await this.routineExerciseRepository.findOne({
            where: { id },
            relations: { routine: { user: true }, exercise: true },
        });
        if (!routineExercise) {
            throw new ResourceNotFoundException('RoutineExercise', id);
        }
        assertOwnership(currentUser, routineExercise.routine.user.id, 'ejercicio de rutina');
        return routineExercise;
    }

    async update(id: number, dto: UpdateRoutineExerciseDto, currentUser: User): Promise<RoutineExercise> {
        const routineExercise = await this.findOne(id, currentUser);
        const { exerciseId, ...data } = dto;

        if (exerciseId) {
            routineExercise.exercise = await this.exercisesService.findOne(exerciseId);
        }
        this.routineExerciseRepository.merge(routineExercise, data);
        await this.routineExerciseRepository.save(routineExercise);
        return this.findOne(id, currentUser);
    }

    async remove(id: number, currentUser: User): Promise<{ id: number }> {
        const routineExercise = await this.findOne(id, currentUser);
        await this.routineExerciseRepository.delete(routineExercise.id);
        return { id };
    }
}
