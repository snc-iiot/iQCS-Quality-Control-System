// src/services/process-management/process-management.module.ts
import { Module } from '@nestjs/common';
import { ProcessManagementService } from './process-management.service';
import { ProcessManagementController } from './process-management.controller';
import { ProcessManagement } from './entities/process-management.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module'; // Import UsersModule

@Module({
  imports: [TypeOrmModule.forFeature([ProcessManagement]), UsersModule],
  controllers: [ProcessManagementController],
  providers: [ProcessManagementService],
})
export class ProcessManagementModule {}
