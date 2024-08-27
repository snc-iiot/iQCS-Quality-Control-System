import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartManagement } from './entities/part-meterial.entity';
import { TServiceResponse } from 'src/types';
import { CreatePartDto, UpdatePartDto, FindPartDto } from './dto';

@Injectable()
export class PartManagementService {
  constructor(
    @InjectRepository(PartManagement)
    private readonly PartManagementRepository: Repository<PartManagement>,
  ) {}

  async create(input: CreatePartDto): Promise<TServiceResponse> {
    try {
      const partExists = await this.PartManagementRepository.find({
        where: { part_code: input.part_code },
        take: 1,
      });

      if (partExists.length > 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Part already exists',
          data: [],
        };

      const record = {
        part_code: input.part_code,
        part_name: input.part_name,
        part_description: input.part_description ?? '',
      };
      const created = await this.PartManagementRepository.save(record);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Part created successfully',
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

  async update(input: UpdatePartDto): Promise<TServiceResponse> {
    try {
      const record = {
        part_name: input.part_name,
        part_description: input.part_description ?? '',
      };
      const updated = await this.PartManagementRepository.update(
        { part_code: input.part_code },
        record,
      );

      return {
        status: 'success',
        statusCode: 200,
        message: 'Part updated successfully',
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

  async findAll(): Promise<TServiceResponse> {
    try {
      const results = await this.PartManagementRepository.find({
        order: { created_at: 'DESC' },
        select: [
          'part_code',
          'part_name',
          'part_description',
          'created_at',
          'updated_at',
        ],
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'All Parts',
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

  async findOne(input: FindPartDto): Promise<TServiceResponse> {
    try {
      const results = await this.PartManagementRepository.find({
        where: { part_code: input.part_code },
        take: 1,
        order: { created_at: 'DESC' },
        select: [
          'part_code',
          'part_name',
          'part_description',
          'created_at',
          'updated_at',
        ],
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Part information',
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

  async delete(input: FindPartDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.PartManagementRepository.delete({
        part_code: input.part_code,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Part deleted successfully',
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
