import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NgCases } from './entities/ng-case.entity';
import { TJwtPayload, TServiceResponse } from 'src/types';
import { CreateNgCaseDto, UpdateNgCaseDto, FindNgCaseDto } from './dto';

@Injectable()
export class NgCaseService {
  constructor(
    @InjectRepository(NgCases)
    private readonly ngCaseRepository: Repository<NgCases>,
  ) {}

  async create(
    input: CreateNgCaseDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const record = {
        case_name: input.case_name,
        description: input.description ?? '',
        processes: input.processes,
        plant_code: decoded.plant_code,
      };
      const created = await this.ngCaseRepository.save(record);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Ng case created successfully',
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
      const updated = await this.ngCaseRepository.update(
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
      console.log(decoded);
      const results = await this.ngCaseRepository.find({
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
      const results = await this.ngCaseRepository.find({
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
      const deleted = await this.ngCaseRepository.delete({
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
}
