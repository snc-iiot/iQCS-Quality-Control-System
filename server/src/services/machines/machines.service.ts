import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities';
import { TServiceResponse, TJwtPayload } from 'src/types';
import { CreateMachineDto, UpdateMachineDto, FindMachineDto } from './dto';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
  ) {}

  async create(
    input: CreateMachineDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const record = {
        machine_no: input.machine_no ?? '',
        machine_name: input.machine_name,
        description: input.description ?? '',
        location: input.location,
        plant_code: decoded.plant_code,
      };
      const created = await this.machineRepository.save(record);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Machine created successfully',
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

  async update(input: UpdateMachineDto): Promise<TServiceResponse> {
    try {
      const record = {
        machine_no: input.machine_no ?? '',
        machine_name: input.machine_name,
        description: input.description ?? '',
        location: input.location ?? '',
      };
      const updated = await this.machineRepository.update(
        { machine_id: input.machine_id },
        record,
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Machine updated successfully',
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

  async findAll(decoded: TJwtPayload): Promise<TServiceResponse> {
    try {
      const results = await this.machineRepository.find({
        where: {
          plant_code: decoded.plant_code,
        },
        order: {
          created_at: 'DESC',
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'All Machines',
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

  async findOne(input: FindMachineDto): Promise<TServiceResponse> {
    try {
      const results = await this.machineRepository.find({
        where: {
          machine_id: input.machine_id,
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get Machine',
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

  async delete(input: FindMachineDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.machineRepository.delete({
        machine_id: input.machine_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Machine deleted successfully',
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
