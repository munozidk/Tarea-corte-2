import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { Auth } from '../decorators/auth.decorator';
import { PERMISSIONS } from '../constants/permissions.constant';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Antes era público: cualquiera podía crearse una cuenta con roleId = 1 (admin).
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(PERMISSIONS.CREATE_USER)
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Auth(PERMISSIONS.READ_USER)
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Auth(PERMISSIONS.READ_USER)
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Auth(PERMISSIONS.UPDATE_USER)
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Auth(PERMISSIONS.DELETE_USER)
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.userService.remove(id);
    }
}
