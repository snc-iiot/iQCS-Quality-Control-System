import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductivityService } from './productivity.service';
import { ProductivityController } from './productivity.controller';
import { ProductivityLogging } from './entities';
import { PartManagement } from 'src/services/part-management/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ProductivityLogging, PartManagement])],
  controllers: [ProductivityController],
  providers: [ProductivityService],
})
export class ProductivityModule {}
