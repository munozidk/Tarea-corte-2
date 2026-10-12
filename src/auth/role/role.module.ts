import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';

import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission])],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
