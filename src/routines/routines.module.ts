import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../auth/user/user.module';

import { Routine } from './entities/routine.entity';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Routine]), UserModule],
    controllers: [RoutinesController],
    providers: [RoutinesService],
    exports: [RoutinesService],
})
export class RoutinesModule {}
