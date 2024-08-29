import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { Process } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Process])],
  controllers: [ProcessesController],
  providers: [ProcessesService],
})
export class ProcessesModule {}
