import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoutinesModule } from '../routines/routines.module';
import { UserModule } from '../auth/user/user.module';

import { ActivityLog } from './entities/activity-log.entity';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityLog]), RoutinesModule, UserModule],
    controllers: [ActivityLogsController],
    providers: [ActivityLogsService],
    exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
