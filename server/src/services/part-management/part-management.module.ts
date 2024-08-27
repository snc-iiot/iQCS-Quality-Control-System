import { Module } from '@nestjs/common';
import { PartManagementService } from './part-management.service';
import { PartManagementController } from './part-management.controller';
import { PartManagement } from './entities/part-meterial.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PartManagement])],
  controllers: [PartManagementController],
  providers: [PartManagementService],
})
export class PartManagementModule {}
