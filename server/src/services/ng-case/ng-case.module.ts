import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NgCases } from './entities';
import { NgCaseService } from './ng-case.service';
import { NgCaseController } from './ng-case.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NgCases])],
  providers: [NgCaseService],
  controllers: [NgCaseController],
})
export class NgCaseModule {}
