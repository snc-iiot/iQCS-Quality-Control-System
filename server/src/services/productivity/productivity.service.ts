import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductivityLogging } from './entities';
import { Part } from 'src/services/parts/entities';
import { TServiceResponse } from 'src/types';
import { CreateProductivityDto, FindByDatetimeRangeDto } from './dto/';
import { TJwtPayload } from 'src/types';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

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
      if (!decoded || !decoded.user_id) {
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid token payload: user_id is missing',
          data: [],
        };
      }

      const checkPartExists = await this.PartRepository.findOne({
        where: { part_code: input.part_code },
      });

      if (!checkPartExists)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Part Code not found',
          data: [],
        };

      const record = {
        datetime: input.datetime,
        process: input.process,
        machine_name: input.machine_name ?? '',
        part_code: input.part_code,
        quantity: input.quantity,
        remarks: input.remarks ?? '',
        creator_id: decoded.user_id,
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

  async findRawDataByDatetimeRange(
    input: FindByDatetimeRangeDto,
  ): Promise<TServiceResponse> {
    try {
      const results =
        await this.ProductivityLoggingRepository.createQueryBuilder('t1')
          .where('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
            start_datetime: input.start_datetime,
            end_datetime: input.end_datetime,
          })
          .leftJoin('tb_part_material', 't2', 't1.part_code = t2.part_code')
          .leftJoin('tb_users', 't3', 't1.creator_id = t3.user_id')
          .select(
            `t1.*
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI'))  as time_slot
          ,(case when extract(hour from datetime) >= 8 and extract(hour from datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,t2.part_name,t3.name AS creator_name`,
          )
          .orderBy('t1.created_at', 'DESC')
          .getRawMany();

      return {
        status: 'success',
        statusCode: 200,
        message: 'Productivity raw data by datetime range',
        data: results,
        // data: [input],
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
