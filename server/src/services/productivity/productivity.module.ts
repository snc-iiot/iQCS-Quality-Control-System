import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductivityService } from './productivity.service';
import { ProductivityController } from './productivity.controller';
import { ProductivityLogging } from './entities';
import { Part } from 'src/services/parts/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ProductivityLogging, Part])],
  controllers: [ProductivityController],
  providers: [ProductivityService],
})
export class ProductivityModule {}
