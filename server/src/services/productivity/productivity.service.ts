import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductivityLogging } from './entities';
import { Part } from 'src/services/parts/entities';
import { TServiceResponse } from 'src/types';
import { CreateProductivityDto } from './dto/';
import { TJwtPayload } from 'src/types';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  CreateProductivityDto,
  UpdateProductivityDto,
  FindProductivityDto,
  FindByDateDto,
  FindByDatetimeDto,
  FindByDatetimeRangeDto,
} from './dto/';

@Injectable()
export class ProductivityService {
  constructor(
    @InjectRepository(ProductivityLogging)
    private readonly ProductivityLoggingRepository: Repository<ProductivityLogging>,
    @InjectRepository(Part)
    private readonly PartRepository: Repository<Part>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    input: CreateProductivityDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const checkPartExists = await this.PartRepository.findOne({
        where: { part_id: input.part_id, plant_code: decoded.plant_code },
      });

      if (!checkPartExists)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Part not found',
          data: [],
        };

      const record = {
        datetime: input.datetime,
        process_id: input.process_id,
        machine_id: !Boolean(input.machine_id) ? null : input.machine_id,
        part_id: input.part_id,
        quantity: input.quantity,
        remarks: input.remarks ?? '',
        creator_id: decoded.user_id,
        plant_code: decoded.plant_code,
      };

      const created = await this.ProductivityLoggingRepository.save(record);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Productivity created successfully',
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
