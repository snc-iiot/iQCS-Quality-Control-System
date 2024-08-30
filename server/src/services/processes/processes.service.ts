import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Process } from './entities';
import { TServiceResponse, TJwtPayload } from 'src/types';
import {
  CreateProcessDto,
  UpdateProcessDto,
  UpdateProcessOrderDto,
  FindProcessDto,
} from './dto';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Process)
    private readonly processRepository: Repository<Process>,
  ) {}

  async create(
    input: CreateProcessDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const processExists = await this.processRepository.find({
        where: {
          process_name: input.process_name,
          plant_code: decoded.plant_code,
        },
      });

      if (processExists.length > 0) {
        return {
          status: 'error',
          statusCode: 400,
          message: 'Process already exists',
          data: [],
        };
      }

      const record = {
        process_name: input.process_name,
        process_description: input.process_description ?? '',
        process_color: input.process_color ?? '#0f0',
        plant_code: decoded.plant_code,
      };
      const created = await this.processRepository.save(record);

      return {
        status: 'success',
        statusCode: 201,
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
        process_color: input.process_color ?? '#0f0',
      };
      const updated = await this.processRepository.update(
        { process_id: input.process_id },
        record,
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Process updated successfully',
        data: [updated],
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

  async updateOrder(input: UpdateProcessOrderDto): Promise<TServiceResponse> {
    try {
      input.processes.forEach(async (process, index) => {
        const record = {
          process_order: index + 1,
        };
        await this.processRepository.update({ process_id: process }, record);
      });

      return {
        status: 'success',
        statusCode: 201,
        message: 'Process order updated successfully',
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

  async findAll(decoded: TJwtPayload): Promise<TServiceResponse> {
    try {
      const results = await this.processRepository.find({
        where: {
          plant_code: decoded.plant_code,
        },
        order: {
          process_order: 'ASC',
          created_at: 'ASC',
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'All Processes',
        data: results,
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

  async findOne(input: FindProcessDto): Promise<TServiceResponse> {
    try {
      const results = await this.processRepository.find({
        where: {
          process_id: input.process_id,
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get Process',
        data: results,
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
      const deleted = await this.processRepository.delete({
        process_id: input.process_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Process deleted successfully',
        data: [deleted],
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
