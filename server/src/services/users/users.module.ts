// src/services/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule], // Export TypeOrmModule so that UserRepository can be used in other modules
  providers: [],
  controllers: [],
})
export class UsersModule {}
