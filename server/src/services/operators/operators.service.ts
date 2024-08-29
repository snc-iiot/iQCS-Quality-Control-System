import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator } from './entities';
import { TServiceResponse, TJwtPayload } from 'src/types';
import { CreateOperatorDto, UpdateOperatorDto, FindOperatorDto } from './dto';

@Injectable()
export class OperatorsService {
  constructor(
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
  ) {}

  async create(
    input: CreateOperatorDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const record = {
        employee_id: input.employee_id ?? '',
        operator_name: input.operator_name,
        position: input.position ?? '',
        responsibility: input.responsibility ?? '',
        remarks: input.remarks ?? '',
        plant_code: decoded.plant_code,
      };
      const created = await this.operatorRepository.save(record);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Operator created successfully',
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

  async update(input: UpdateOperatorDto): Promise<TServiceResponse> {
    try {
      const record = {
        employee_id: input.employee_id ?? '',
        operator_name: input.operator_name,
        position: input.position ?? '',
        responsibility: input.responsibility ?? '',
        remarks: input.remarks ?? '',
      };
      const updated = await this.operatorRepository.update(
        { operator_id: input.operator_id },
        record,
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Operator updated successfully',
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
      const results = await this.operatorRepository.find({
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
        message: 'All Operators',
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

  async findOne(input: FindOperatorDto): Promise<TServiceResponse> {
    try {
      const results = await this.operatorRepository.find({
        where: {
          operator_id: input.operator_id,
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get Operator',
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

  async delete(input: FindOperatorDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.operatorRepository.delete({
        operator_id: input.operator_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Operator deleted successfully',
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
