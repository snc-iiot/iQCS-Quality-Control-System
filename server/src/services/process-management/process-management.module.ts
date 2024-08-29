import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessManagementService } from './process-management.service';
import { ProcessManagementController } from './process-management.controller';
import { ProcessManagement } from './entities/process-management.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessManagement, User]), // Include User entity
  ],
  controllers: [ProcessManagementController],
  providers: [ProcessManagementService],
})
export class ProcessManagementModule {}
