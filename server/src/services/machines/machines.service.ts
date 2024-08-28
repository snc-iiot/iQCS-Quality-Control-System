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

  /*
  async create(
    input: CreateMachineDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const record = {
        case_name: input.case_name,
        description: input.description ?? '',
        processes: input.processes,
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

  async update(input: UpdateNgCaseDto): Promise<TServiceResponse> {
    try {
      const record = {
        case_name: input.case_name,
        description: input.description ?? '',
        processes: input.processes,
      };
      const updated = await this.NgCaseRepository.update(
        { case_id: input.case_id },
        record,
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Ng case updated successfully',
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
      const results = await this.NgCaseRepository.find({
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
        message: 'All Ng cases',
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

  async findOne(input: FindNgCaseDto): Promise<TServiceResponse> {
    try {
      const results = await this.NgCaseRepository.find({
        where: {
          case_id: input.case_id,
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get NG case',
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

  async delete(input: FindNgCaseDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.NgCaseRepository.delete({
        case_id: input.case_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Ng case deleted successfully',
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
    */
}
