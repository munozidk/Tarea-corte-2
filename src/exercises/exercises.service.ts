import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceNotFoundException } from '../common/exceptions';

import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,
    ) {}

    async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
        const exercise = this.exerciseRepository.create(createExerciseDto);
        return await this.exerciseRepository.save(exercise);
    }

    async findAll(): Promise<Exercise[]> {
        return await this.exerciseRepository.find({ order: { name: 'ASC' } });
    }

    async findOne(id: number): Promise<Exercise> {
        const exercise = await this.exerciseRepository.findOneBy({ id });
        if (!exercise) {
            throw new ResourceNotFoundException('Exercise', id);
        }
        return exercise;
    }

    async update(id: number, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
        const exercise = await this.findOne(id);
        this.exerciseRepository.merge(exercise, updateExerciseDto);
        return await this.exerciseRepository.save(exercise);
    }

    async remove(id: number): Promise<{ id: number }> {
        const exercise = await this.findOne(id);
        // Si alguna rutina lo usa, la FK (RESTRICT) lanza 23503 y el QueryFailedFilter responde 409
        await this.exerciseRepository.remove(exercise);
        return { id };
    }
}
