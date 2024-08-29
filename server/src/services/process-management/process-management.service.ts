import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessManagement } from './entities/process-management.entity';
import { User } from '../users/entities/user.entity';
import { CreateProcessDto } from './dto/create-process.dto';
import { TServiceResponse } from 'src/types';

@Injectable()
export class ProcessManagementService {
  constructor(
    @InjectRepository(ProcessManagement)
    private readonly processManagementRepository: Repository<ProcessManagement>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    input: CreateProcessDto,
    userId: string,
  ): Promise<TServiceResponse> {
    try {
      const processExists = await this.processManagementRepository.findOne({
        where: { process_name: input.process_name },
      });

      if (processExists) {
        return {
          status: 'error',
          statusCode: 400,
          message: 'Process name already exists',
          data: [],
        };
      }

      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        return {
          status: 'error',
          statusCode: 404,
          message: 'User not found',
          data: [],
        };
      }

      const record = this.processManagementRepository.create({
        process_name: input.process_name,
        process_description: input.process_description ?? '',
        process_color: input.process_color,
        process_order: 1,
        plant_code: user.plant_code, // plant_code from user
      });

      const created = await this.processManagementRepository.save(record);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Process created successfully',
        data: [created],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }
}
