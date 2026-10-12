import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceNotFoundException } from '../../common/exceptions';
import { Permission } from '../entities/permission.entity';

/**
 * Los permisos son un catálogo fijo (los usa el código con @Auth), por eso solo se consultan.
 * Crearlos desde la API no tendría efecto: ningún endpoint los exigiría.
 */
@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    async findAll(): Promise<Permission[]> {
        return await this.permissionRepository.find({ order: { id: 'ASC' } });
    }

    async findOne(id: number): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({
            where: { id },
            relations: { rolePermissions: { role: true } },
        });
        if (!permission) {
            throw new ResourceNotFoundException('Permission', id);
        }
        return permission;
    }
}
