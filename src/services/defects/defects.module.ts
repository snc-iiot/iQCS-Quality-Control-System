import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefectService } from './defects.service';
import { DefectController } from './defects.controller';
import { DefectsLogging } from './entities';
import { PartManagement } from 'src/services/part-management/entities';

@Module({
  imports: [TypeOrmModule.forFeature([DefectsLogging, PartManagement])],
  controllers: [DefectController],
  providers: [DefectService],
})
export class DefectModule {}
