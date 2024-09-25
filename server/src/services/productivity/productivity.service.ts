import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductivityLogging } from './entities';
import { Part } from 'src/services/parts/entities';
import { TServiceResponse } from 'src/types';
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

  async findRawDataByDatetimeRange(
    input: FindByDatetimeRangeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const results =
        await this.ProductivityLoggingRepository.createQueryBuilder('t1')
          .where('t1.plant_code = :plant_code', {
            plant_code: decoded.plant_code,
          })
          .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
            start_datetime: input.start_datetime,
            end_datetime: input.end_datetime,
          })
          .leftJoin('tb_part_material', 't2', 't1.part_id = t2.part_id')
          .leftJoin('tb_users', 't3', 't1.creator_id = t3.user_id')
          .leftJoin('tb_operators', 't4', 't1.operator_id = t4.operator_id')
          .select(
            `t1.*
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI'))  as time_slot
          ,(case when extract(hour from datetime) >= 8 and extract(hour from datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,t2.part_code,t2.part_name,t3.name AS creator_name,t4.operator_name`,
          )
          .orderBy('t1.created_at', 'DESC')
          .getRawMany();

      return {
        status: 'success',
        statusCode: 200,
        message: 'Productivity raw data by datetime range',
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

  async summaryByDatetimeRange(
    input: FindByDatetimeRangeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const results =
        await this.ProductivityLoggingRepository.createQueryBuilder('t1')
          .where('t1.plant_code = :plant_code', {
            plant_code: decoded.plant_code,
          })
          .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
            start_datetime: input.start_datetime,
            end_datetime: input.end_datetime,
          })
          .leftJoin('tb_part_material', 't2', 't1.part_id = t2.part_id')
          .leftJoin('tb_processes', 't3', 't1.process_id = t3.process_id')
          .select(
            `t1.datetime
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI'))  as time_slot
          ,(case when extract(hour from t1.datetime) >= 8 and extract(hour from t1.datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,t1.process_id,t3.process_name,t1.part_id,t2.part_code,t2.part_name`,
          )
          .addSelect('SUM(COALESCE(t1.quantity,0)::int)', 'quantity')
          .groupBy(
            't1.datetime,t1.process_id,t3.process_name,t1.part_id,t2.part_code,t2.part_name',
          )
          .getRawMany();

      // const results = await this.DefectsLoggingRepository.query(
      //   'SELECT * FROM tb_defects_logging WHERE datetime = $1',
      //   [input.datetime],
      // );

      const data = results.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
      }));

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects summary by datetime range',
        data: data,
        //    data: results,
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

  async summaryByDate(
    input: FindByDateDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const startDatetime = new Date(`${input.date}T01:00:00Z`);
      const endDatetime = new Date(`${input.date}T01:00:00Z`);
      endDatetime.setHours(endDatetime.getHours() + 23);

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo',
      //   // data: [input],
      //   data: [
      //     {
      //       start_datetime: startDatetime,
      //       end_datetime: endDatetime,
      //     },
      //   ],
      // };
      // /*
      const results =
        await this.ProductivityLoggingRepository.createQueryBuilder('t1')
          .where('t1.plant_code = :plant_code', {
            plant_code: decoded.plant_code,
          })
          .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
            start_datetime: startDatetime,
            end_datetime: endDatetime,
          })
          .leftJoin('tb_part_material', 't2', 't1.part_id = t2.part_id')
          // .leftJoin('tb_users', 't3', 't1.creator_id = t3.user_id')
          .select(
            `t1.datetime,t1.process_id,t1.part_id,t2.part_code,t2.part_name--,t3.name as creator_name
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI'))  as time_slot
          ,(case when extract(hour from t1.datetime) >= 8 and extract(hour from t1.datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,sum(t1.quantity) over (partition by t1.datetime,t1.process_id,t1.part_id) as quantity`,
          )
          .getRawMany();

      // ,first_value(t1.creator_id) over (partition by t1.datetime,t1.process,t1.part_code order by t1.created_at) as creator_id
      // */
      // const results = await this.DefectsLoggingRepository.query(
      //   'SELECT * FROM tb_defects_logging WHERE datetime = $1',
      //   [input.datetime],
      // );

      const summary = results.reduce((acc, cur) => {
        const allProcessAndDateAndPart = acc.map(
          (item) => `${item.process}_${item.datetime}_${item.part_code}`,
        );
        if (
          !allProcessAndDateAndPart.includes(
            `${cur.process}_${cur.datetime}_${cur.part_code}`,
          )
        ) {
          return [
            ...acc,
            {
              datetime: cur.datetime,
              process: cur.process,
              part_code: cur.part_code,
              part_name: cur.part_name,
              quantity: Number(cur.quantity),
              // ng_quantity: Number(cur.ng_quantity),
              creator_id: cur.creator_id,
              creator_name: cur.creator_name,
            },
          ];
        }

        return acc.map((item) => {
          if (
            item.process === cur.process &&
            item.datetime === cur.datetime &&
            item.part_code === cur.part_code
          ) {
            return {
              ...item,
              quantity: item.quantity + Number(cur.quantity),
              // ng_quantity: item.ng_quantity + Number(cur.ng_quantity),
              // rework_quantity:
              //   item.rework_quantity + Number(cur.rework_quantity),
              // rework_cost_per_unit:
              //   item.rework_cost_per_unit + Number(cur.rework_cost_per_unit),
              // scrap_quantity: item.scrap_quantity + Number(cur.scrap_quantity),
              // scrap_cost_per_unit:
              //   item.scrap_cost_per_unit + Number(cur.scrap_cost_per_unit),
            };
          }

          return item;
        });
      }, []);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects summary by date',
        // data: [],
        data: summary,
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

  async update(
    input: UpdateProductivityDto,
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
      };

      const updated = await this.ProductivityLoggingRepository.update(
        { prod_log_id: input.prod_log_id },
        record,
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Productivity updated successfully',
        data: [updated],
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

  async delete(input: FindProductivityDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.ProductivityLoggingRepository.delete({
        prod_log_id: input.prod_log_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Productivity deleted successfully',
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
