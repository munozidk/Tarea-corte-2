import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PERMISSIONS } from '../auth/constants/permissions.constant';
import { User } from '../auth/entities/user.entity';
import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';

import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Controller('routines')
export class RoutinesController {
    constructor(private readonly routinesService: RoutinesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(PERMISSIONS.CREATE_ROUTINE)
    create(@Body() createRoutineDto: CreateRoutineDto, @CurrentUser() user: User) {
        return this.routinesService.create(createRoutineDto, user);
    }

    @Get()
    @Auth(PERMISSIONS.READ_ROUTINE)
    findAll(@CurrentUser() user: User) {
        return this.routinesService.findAll(user);
    }

    @Get(':id')
    @Auth(PERMISSIONS.READ_ROUTINE)
    findOne(@Param('id', PositiveIntPipe) id: number, @CurrentUser() user: User) {
        return this.routinesService.findOne(id, user);
    }

    @Patch(':id')
    @Auth(PERMISSIONS.UPDATE_ROUTINE)
    update(
        @Param('id', PositiveIntPipe) id: number,
        @Body() updateRoutineDto: UpdateRoutineDto,
        @CurrentUser() user: User,
    ) {
        return this.routinesService.update(id, updateRoutineDto, user);
    }

    @Delete(':id')
    @Auth(PERMISSIONS.DELETE_ROUTINE)
    remove(@Param('id', PositiveIntPipe) id: number, @CurrentUser() user: User) {
        return this.routinesService.remove(id, user);
    }
}
