import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefectService } from './defects.service';
import { DefectController } from './defects.controller';
import { DefectsLogging } from './entities';
import { Process } from 'src/services/processes/entities';
import { Part } from 'src/services/parts/entities';

@Module({
  imports: [TypeOrmModule.forFeature([DefectsLogging, Part, Process])],
  controllers: [DefectController],
  providers: [DefectService],
})
export class DefectModule {}
