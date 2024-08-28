import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessManagement } from './entities/process-management.entity';
import { TJwtPayload, TServiceResponse } from 'src/types';
import { CreateProcessDto } from './dto/create-process.dto';

@Injectable()
export class ProcessManagementService {
  constructor(
    @InjectRepository(ProcessManagement)
    private readonly processManagementRepository: Repository<ProcessManagement>,
  ) {}

  async create(
    input: CreateProcessDto,
    // decoded: TJwtPayload,
    userId: string,
  ): Promise<TServiceResponse> {
    try {
      // Check if process_name already exists
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

      // Get plant_code from tb_users table using query builder
      const user = await this.processManagementRepository.query(
        `SELECT plant_code FROM tb_users WHERE user_id = $1 LIMIT 1`,
        [userId],
      );

      if (!user.length) {
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
        plant_code: user[0].plant_code,
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
