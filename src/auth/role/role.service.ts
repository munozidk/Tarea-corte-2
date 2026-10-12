import { Injectable } from '@nestjs/common';
import { ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ResourceNotFoundException, RoleNotFoundException } from '../../common/exceptions';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const newRole = this.roleRepository.create(createRoleDto);
        return await this.roleRepository.save(newRole);
    }

    async findAll(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    async findOne(id: number): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ id });
    }

    /** Igual que findOne pero lanza 404 si no existe (lo usa el controlador). */
    async findOneOrFail(id: number): Promise<Role> {
        const role = await this.findOne(id);
        if (!role) {
            throw new RoleNotFoundException(id);
        }
        return role;
    }

    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
        await this.findOneOrFail(id);
        if (Object.keys(updateRoleDto).length > 0) {
            await this.roleRepository.update(id, updateRoleDto);
        }
        return this.findOneOrFail(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOneOrFail(id);
        // Si hay usuarios con este rol, la FK users.role_id lo impide -> 409 (QueryFailedFilter)
        await this.roleRepository.delete(id);
        return { id };
    }

    /** Lista los permisos asociados a un rol. */
    async getPermissions(roleId: number): Promise<Permission[]> {
        const role = await this.findOneWithPermissions(roleId);
        if (!role) {
            throw new RoleNotFoundException(roleId);
        }
        return role.rolePermissions.map((rp) => rp.permission);
    }

    /** Asocia permisos a un rol (ignora los que ya tenía). Devuelve la lista final. */
    async assignPermissions(roleId: number, permissionIds: number[]): Promise<Permission[]> {
        const role = await this.findOneWithPermissions(roleId);
        if (!role) {
            throw new RoleNotFoundException(roleId);
        }

        const uniqueIds = [...new Set(permissionIds)];
        const permissions = await this.permissionRepository.findBy({ id: In(uniqueIds) });
        const missing = uniqueIds.find((id) => !permissions.some((p) => p.id === id));
        if (missing) {
            throw new ResourceNotFoundException('Permission', missing);
        }

        const current = new Set(role.rolePermissions.map((rp) => rp.permission.id));
        const toAdd = permissions
            .filter((p) => !current.has(p.id))
            .map((permission) => this.rolePermissionRepository.create({ role, permission }));
        await this.rolePermissionRepository.save(toAdd);

        return this.getPermissions(roleId);
    }

    /** Quita un permiso de un rol. */
    async removePermission(roleId: number, permissionId: number): Promise<Permission[]> {
        await this.findOneOrFail(roleId);
        const result = await this.rolePermissionRepository.delete({
            role: { id: roleId },
            permission: { id: permissionId },
        });
        if (!result.affected) {
            throw new ResourceNotFoundException('RolePermission', permissionId);
        }
        return this.getPermissions(roleId);
    }

    /**
     * Retorna todos los roles junto con su listado de usuarios asociados.
     * Utiliza find() con carga de relaciones.
     */
    async findAllWithUsers(): Promise<Role[]> {
        return await this.roleRepository.find({
            relations: {
                users: true,
            },
            order: {
                name: 'ASC',
            },
        });
    }

    /**
     * Retorna un rol con todos sus permisos anidados
     * a través de la relación rolePermissions -> permission.
     */
    async findOneWithPermissions(id: number): Promise<Role | null> {
        return await this.roleRepository.findOne({
            where: { id },
            relations: {
                rolePermissions: {
                    permission: true,
                },
            },
        });
    }

    /**
     * Busca roles cuyo nombre contenga un texto parcial (insensible a mayúsculas/minúsculas).
     * Utiliza ILike dentro de find().
     */
    async searchByName(term: string): Promise<Role[]> {
        return await this.roleRepository.find({
            where: {
                name: ILike(`%${term}%`),
            },
            order: {
                name: 'ASC',
            },
        });
    }
}
