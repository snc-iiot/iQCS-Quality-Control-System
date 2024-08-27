import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessManagement } from './entities/process-management.entity';
import { TServiceResponse } from 'src/types';
import { CreateProcessDto, UpdateProcessDto, FindProcessDto } from './dto';

@Injectable()
export class ProcessManagementService {
  constructor(
    @InjectRepository(ProcessManagement)
    private readonly ProcessManagementRepository: Repository<ProcessManagement>,
  ) {}

  async create(input: CreateProcessDto): Promise<TServiceResponse> {
    try {
      const processExists = await this.ProcessManagementRepository.find({
        where: { process_code: input.process_code },
        take: 1,
      });

      if (processExists.length > 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Process already exists',
          data: [],
        };

      const record = {
        process_code: input.process_code,
        process_name: input.process_name,
        process_description: input.process_description ?? '',
      };
      const created = await this.ProcessManagementRepository.save(record);

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

  async update(input: UpdateProcessDto): Promise<TServiceResponse> {
    try {
      const record = {
        process_name: input.process_name,
        process_description: input.process_description ?? '',
      };
      const updated = await this.ProcessManagementRepository.update(
        { process_code: input.process_code },
        record,
      );

      if (updated.affected === 0)
        return {
          status: 'error',
          statusCode: 404,
          message: 'Process not found',
          data: [],
        };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Process updated successfully',
        data: [],
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

  async delete(input: FindProcessDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.ProcessManagementRepository.delete({
        process_code: input.process_code,
      });

      if (deleted.affected === 0)
        return {
          status: 'error',
          statusCode: 404,
          message: 'Process not found',
          data: [],
        };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Process deleted successfully',
        data: [],
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
