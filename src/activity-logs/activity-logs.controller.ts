import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PERMISSIONS } from '../auth/constants/permissions.constant';
import { User } from '../auth/entities/user.entity';
import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';

import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Controller('activity-logs')
export class ActivityLogsController {
    constructor(private readonly activityLogsService: ActivityLogsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(PERMISSIONS.CREATE_ACTIVITY_LOG)
    create(@Body() dto: CreateActivityLogDto, @CurrentUser() user: User) {
        return this.activityLogsService.create(dto, user);
    }

    @Get()
    @Auth(PERMISSIONS.READ_ACTIVITY_LOG)
    findAll(@CurrentUser() user: User) {
        return this.activityLogsService.findAll(user);
    }

    @Get(':id')
    @Auth(PERMISSIONS.READ_ACTIVITY_LOG)
    findOne(@Param('id', PositiveIntPipe) id: number, @CurrentUser() user: User) {
        return this.activityLogsService.findOne(id, user);
    }

    @Patch(':id')
    @Auth(PERMISSIONS.UPDATE_ACTIVITY_LOG)
    update(@Param('id', PositiveIntPipe) id: number, @Body() dto: UpdateActivityLogDto, @CurrentUser() user: User) {
        return this.activityLogsService.update(id, dto, user);
    }

    @Delete(':id')
    @Auth(PERMISSIONS.DELETE_ACTIVITY_LOG)
    remove(@Param('id', PositiveIntPipe) id: number, @CurrentUser() user: User) {
        return this.activityLogsService.remove(id, user);
    }
}
