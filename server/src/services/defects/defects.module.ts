import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefectService } from './defects.service';
import { DefectController } from './defects.controller';
import { DefectsLogging } from './entities';
import { Part } from 'src/services/parts/entities';

@Module({
  imports: [TypeOrmModule.forFeature([DefectsLogging, Part])],
  controllers: [DefectController],
  providers: [DefectService],
})
export class DefectModule {}
