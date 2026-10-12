import { Controller, Get, Param } from '@nestjs/common';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { Auth } from '../decorators/auth.decorator';
import { PERMISSIONS } from '../constants/permissions.constant';

import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get()
    @Auth(PERMISSIONS.READ_PERMISSION)
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(':id')
    @Auth(PERMISSIONS.READ_PERMISSION)
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.permissionService.findOne(id);
    }
}
