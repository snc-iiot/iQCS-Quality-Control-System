// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, Plant } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Plant])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
