import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { Auth } from '../decorators/auth.decorator';
import { PERMISSIONS } from '../constants/permissions.constant';

import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(PERMISSIONS.CREATE_ROLE)
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    @Auth(PERMISSIONS.READ_ROLE)
    findAll() {
        return this.roleService.findAll();
    }

    @Get(':id')
    @Auth(PERMISSIONS.READ_ROLE)
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.roleService.findOneOrFail(id);
    }

    @Patch(':id')
    @Auth(PERMISSIONS.UPDATE_ROLE)
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @Auth(PERMISSIONS.DELETE_ROLE)
    remove(@Param('id', PositiveIntPipe) id: number) {
        return this.roleService.remove(id);
    }

    // ---------- Asociación rol <-> permisos ----------

    /** Permisos que tiene un rol */
    @Get(':id/permissions')
    @Auth(PERMISSIONS.READ_ROLE, PERMISSIONS.READ_PERMISSION)
    getPermissions(@Param('id', PositiveIntPipe) id: number) {
        return this.roleService.getPermissions(id);
    }

    /** Agrega uno o varios permisos a un rol. Body: { "permissionIds": [1, 2] } */
    @Post(':id/permissions')
    @Auth(PERMISSIONS.ASSIGN_PERMISSION)
    assignPermissions(@Param('id', PositiveIntPipe) id: number, @Body() dto: AssignPermissionsDto) {
        return this.roleService.assignPermissions(id, dto.permissionIds);
    }

    /** Quita un permiso de un rol */
    @Delete(':id/permissions/:permissionId')
    @Auth(PERMISSIONS.ASSIGN_PERMISSION)
    removePermission(
        @Param('id', PositiveIntPipe) id: number,
        @Param('permissionId', PositiveIntPipe) permissionId: number,
    ) {
        return this.roleService.removePermission(id, permissionId);
    }
}
