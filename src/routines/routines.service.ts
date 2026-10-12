import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceNotFoundException } from '../common/exceptions';
import { User } from '../auth/entities/user.entity';
import { UserService } from '../auth/user/user.service';
import { assertOwnership, canManageAll } from '../auth/utils/permissions.util';

import { Routine } from './entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutinesService {
    constructor(
        @InjectRepository(Routine)
        private readonly routineRepository: Repository<Routine>,
        private readonly userService: UserService,
    ) {}

    async create(createRoutineDto: CreateRoutineDto, currentUser: User): Promise<Routine> {
        const { userId, ...data } = createRoutineDto;

        let owner = currentUser;
        if (userId && userId !== currentUser.id) {
            if (!canManageAll(currentUser)) {
                throw new ForbiddenException('Acceso denegado: no puedes crear rutinas para otro usuario');
            }
            owner = await this.userService.findOne(userId); // 404 si no existe
        }

        const routine = this.routineRepository.create({ ...data, user: owner });
        const saved = await this.routineRepository.save(routine);
        return this.findOne(saved.id, currentUser);
    }

    /** Admin (manage_all_records) ve todas; un usuario normal solo las suyas. */
    async findAll(currentUser: User): Promise<Routine[]> {
        return await this.routineRepository.find({
            where: canManageAll(currentUser) ? {} : { user: { id: currentUser.id } },
            relations: { user: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number, currentUser: User): Promise<Routine> {
        const routine = await this.routineRepository.findOne({
            where: { id },
            relations: { user: true, routineExercises: { exercise: true } },
            order: { routineExercises: { orderIndex: 'ASC' } },
        });
        if (!routine) {
            throw new ResourceNotFoundException('Routine', id);
        }
        assertOwnership(currentUser, routine.user.id, 'rutina');
        return routine;
    }

    async update(id: number, updateRoutineDto: UpdateRoutineDto, currentUser: User): Promise<Routine> {
        const routine = await this.findOne(id, currentUser);
        if (Object.keys(updateRoutineDto).length > 0) {
            await this.routineRepository.update(routine.id, updateRoutineDto);
        }
        return this.findOne(id, currentUser);
    }

    async remove(id: number, currentUser: User): Promise<{ id: number }> {
        const routine = await this.findOne(id, currentUser);
        await this.routineRepository.delete(routine.id);
        return { id };
    }
}
