import { FolderService } from './folder.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderController } from './folder.controller';
import { Folder } from './entities';
import { Document } from '../documents/entities';
import { User } from '../users/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, Document, User])],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
