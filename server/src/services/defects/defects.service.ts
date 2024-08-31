import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DefectsLogging } from './entities';
import { Process } from 'src/services/processes/entities';
import { Part } from 'src/services/parts/entities';
import { TServiceResponse } from 'src/types';
import {
  CreateDefectsDto,
  UpdateDefectsDto,
  FindByDateDto,
  FindTopRankDto,
  FindByDatetimeRangeDto,
  FindDefectsDto,
  FindByDateRangeDto,
  FindTopRankDateRangeDto,
} from './dto';
import { TJwtPayload } from 'src/types';
import { FtpUploadFileFromBase64 } from 'src/common/utils';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class DefectService {
  constructor(
    @InjectRepository(DefectsLogging)
    private readonly defectsLoggingRepository: Repository<DefectsLogging>,
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
    @InjectRepository(Process)
    private readonly processRepository: Repository<Process>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  randomString(length: number = 8): string {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let randomstring = '';
    for (let i = 0; i < length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  async create(
    input: CreateDefectsDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const checkPartExists = await this.partRepository.findOne({
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
        defects_type: input.defects_type,
        process_id: input.process_id,
        part_id: input.part_id,
        case_id: input.case_id,
        ng_quantity: input.ng_quantity,
        //! Not required
        machine_id: !Boolean(input.machine_id) ? null : input.machine_id,
        operator_id: !Boolean(input.operator_id) ? null : input.operator_id,
        production_quantity: input.production_quantity ?? 0,
        rework_quantity: input.rework_quantity ?? 0,
        scrap_quantity: input.scrap_quantity ?? 0,
        claim_supplier_quantity: input.claim_supplier_quantity ?? 0,
        scrap_approval_sheet_no: input.scrap_approval_sheet_no ?? '',
        car_no: input.car_no ?? '',
        image: null,
        solve_problem: input.solve_problem ?? '',
        remarks: input.remarks ?? '',
        creator_id: decoded.user_id,
        plant_code: decoded.plant_code,
      };

      // /*
      if (input.image !== '' && input.image !== null) {
        const filename = `${input.case_id}_${this.randomString(8)}_${Date.now()}.png`;
        const remotePath = `/CoDE_Data/toolbox/docs/v1/${filename}`;
        const isUploaded = await FtpUploadFileFromBase64(
          // input.image,
          input.image.replace(/^data:image\/\w+;base64,/, ''),
          remotePath,
        );
        // console.log('isUploaded', isUploaded);
        // https://sncservices.sncformer.com/data/toolbox/docs/v1/test.png
        if (isUploaded)
          record.image = `https://sncservices.sncformer.com/data/toolbox/docs/v1/${filename}`;
      }
      // */

      const created = await this.defectsLoggingRepository.save(record);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Defect created successfully',
        data: [created],
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

  async findRawDataByDatetimeRange(
    input: FindByDatetimeRangeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Check Cache
      // const cacheKey = `/toolbox/v1/defects-logging/raw-data-by-datetime-range_${input.start_datetime}_${input.end_datetime}`;
      // // console.log(cacheKey);
      // const cacheTTL = 5 * 1000; // 5 seconds
      // const cacheValue = await this.cacheManager.get(cacheKey);
      // if (cacheValue !== undefined) {
      //   return {
      //     status: 'success',
      //     statusCode: 200,
      //     message: 'Data (Cache)',
      //     data: cacheValue as any[],
      //   };
      // }
      // //! ./Check Cache

      // const datetime = new Date(input.datetime);
      // if (process.platform === 'win32')
      // datetime.setHours(datetime.getHours() - 7);
      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: input.start_datetime,
          end_datetime: input.end_datetime,
        })
        .leftJoin('tb_ng_cases', 't2', 't1.case_id = t2.case_id')
        .leftJoin('tb_users', 't3', 't1.creator_id = t3.user_id')
        .leftJoin('tb_part_material', 't4', 't1.part_id = t4.part_id')
        .select(
          `t1.*
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI'))  as time_slot
          ,(case when extract(hour from t1.datetime) >= 8 and extract(hour from t1.datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,t2.case_name,t2.description AS ng_description,t3.name AS creator_name,t4.part_code,t4.part_name`,
        )
        .orderBy('t1.created_at', 'DESC')
        .getRawMany();

      // const data = results.map((item) => ({
      //   ...item,
      //   rework_cost_per_unit: Number(item.rework_cost_per_unit),
      //   scrap_cost_per_unit: Number(item.scrap_cost_per_unit),
      // }));

      // //! Check Cache
      // await this.cacheManager.set(cacheKey, data, cacheTTL);
      // //! ./Check Cache

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects raw data by datetime range',
        // data: data,
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

  async summaryByDatetimeRange(
    input: FindByDatetimeRangeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: input.start_datetime,
          end_datetime: input.end_datetime,
        })
        .leftJoin('tb_ng_cases', 't2', 't1.case_id = t2.case_id')
        .leftJoin('tb_processes', 't3', 't1.process_id = t3.process_id')
        .select(
          `t1.datetime
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI')) as time_slot
          ,(case when extract(hour from t1.datetime) >= 8 and extract(hour from t1.datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,t1.process_id,t3.process_name,t1.case_id,t2.case_name,t2.description AS ng_description`,
        )
        .addSelect('SUM(COALESCE(t1.ng_quantity,0)::int)', 'ng_quantity')
        .addSelect(
          'SUM(COALESCE(t1.rework_quantity,0)::int)',
          'rework_quantity',
        )
        // .addSelect(
        //   'SUM(COALESCE(t1.rework_cost_per_unit,0))',
        //   'rework_cost_per_unit',
        // )
        .addSelect('SUM(COALESCE(t1.scrap_quantity,0)::int)', 'scrap_quantity')
        // .addSelect(
        //   'SUM(COALESCE(t1.scrap_cost_per_unit,0))',
        //   'scrap_cost_per_unit',
        // )
        .groupBy(
          `t1.datetime,t1.process_id,t3.process_name,t1.case_id,t2.case_name,t2.description`,
          // `t1.datetime,concat(to_char(t1.datetime, 'HH:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH:MI')), t1.process, t1.ng_id, t2.case_name, t2.description`,
        )
        .getRawMany();

      // const results = await this.DefectsLoggingRepository.query(
      //   'SELECT * FROM tb_defects_logging WHERE datetime = $1',
      //   [input.datetime],
      // );

      const data = results.map((item) => ({
        ...item,
        ng_quantity: Number(item.ng_quantity),
        rework_quantity: Number(item.rework_quantity),
        // rework_cost_per_unit: Number(item.rework_cost_per_unit),
        scrap_quantity: Number(item.scrap_quantity),
        // scrap_cost_per_unit: Number(item.scrap_cost_per_unit),
      }));

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects summary by datetime range',
        data: data,
        // data: results,
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
      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        })
        .leftJoin('tb_users', 't3', 't1.creator_id = t3.user_id')
        .leftJoin('tb_processes', 't4', 't1.process_id = t4.process_id')
        .select(
          `t1.datetime
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI'))  as time_slot
          ,(case when extract(hour from t1.datetime) >= 8 and extract(hour from t1.datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,t1.process_id,t4.process_name,t3.name as creator_name
,sum(t1.ng_quantity) over (partition by t1.datetime,t1.process_id) as ng_quantity
,sum(coalesce(t1.rework_quantity, 0)) over (partition by t1.datetime,t1.process_id) as rework_quantity
,sum(coalesce(t1.scrap_quantity, 0)) over (partition by t1.datetime,t1.process_id) as scrap_quantity`,
        )
        .getRawMany();

      //! ,first_value(t1.inspector_id) over (partition by t1.datetime,t1.process_id order by t1.created_at) as inspector_id

      // */
      // const results = await this.DefectsLoggingRepository.query(
      //   'SELECT * FROM tb_defects_logging WHERE datetime = $1',
      //   [input.datetime],
      // );

      const summary = results.reduce((acc, cur) => {
        const allProcessAndDate = acc.map(
          (item) => `${item.process_id}_${item.datetime}`,
        );
        if (!allProcessAndDate.includes(`${cur.process_id}_${cur.datetime}`)) {
          return [
            ...acc,
            {
              datetime: cur.datetime,
              time_slot: cur.time_slot,
              shift: cur.shift,
              process_id: cur.process_id,
              process_name: cur.process_name,
              ng_quantity: Number(cur.ng_quantity),
              rework_quantity: Number(cur.rework_quantity),
              // rework_cost_per_unit: Number(cur.rework_cost_per_unit),
              scrap_quantity: Number(cur.scrap_quantity),
              // scrap_cost_per_unit: Number(cur.scrap_cost_per_unit),
              creator_id: cur.creator_id,
              creator_name: cur.creator_name,
            },
          ];
        }

        return acc.map((item) => {
          if (
            item.process_id === cur.process_id &&
            item.datetime === cur.datetime
          ) {
            return {
              ...item,
              ng_quantity: item.ng_quantity + Number(cur.ng_quantity),
              rework_quantity:
                item.rework_quantity + Number(cur.rework_quantity),
              // rework_cost_per_unit:
              //   item.rework_cost_per_unit + Number(cur.rework_cost_per_unit),
              scrap_quantity: item.scrap_quantity + Number(cur.scrap_quantity),
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

  async graphSummaryByDate(
    input: FindByDateDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      // //! Check Cache
      // const cacheKey = `/toolbox/v1/defects-logging/graph-summary-by-date_${input.date}`;
      // // console.log(cacheKey);
      // const cacheTTL = 30 * 1000; // 30 seconds
      // const cacheValue = await this.cacheManager.get(cacheKey);
      // if (cacheValue !== undefined) {
      //   return {
      //     status: 'success',
      //     statusCode: 200,
      //     message: 'Data (Cache)',
      //     data: cacheValue as any[],
      //   };
      // }
      // //! ./Check Cache

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
      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        })
        .leftJoin('tb_processes', 't2', 't1.process_id = t2.process_id')
        .select(
          `t1.datetime
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI'))  as time_slot
          ,(case when extract(hour from t1.datetime) >= 8 and extract(hour from t1.datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,t1.process_id,t2.process_name
          ,sum(t1.ng_quantity) over (partition by t1.datetime,t1.process_id) as ng_quantity`,
        )
        .orderBy('t1.datetime', 'ASC')
        .getRawMany();

      const summary = results.reduce((acc, cur) => {
        const allProcessAndDate = acc.map(
          (item) => `${item.process_id}_${item.datetime}`,
        );
        if (!allProcessAndDate.includes(`${cur.process_id}_${cur.datetime}`)) {
          return [
            ...acc,
            {
              datetime: cur.datetime,
              time_slot: cur.time_slot,
              shift: cur.shift,
              process_id: cur.process_id,
              process_name: cur.process_name,
              ng_quantity: Number(cur.ng_quantity),
            },
          ];
        }

        return acc.map((item) => {
          if (
            item.process_id === cur.process_id &&
            item.datetime === cur.datetime
          ) {
            return {
              ...item,
              ng_quantity: item.ng_quantity + Number(cur.ng_quantity),
            };
          }

          return item;
        });
      }, []);

      // : { process_id: string; process_name: string }[]
      const allProcesses = await this.processRepository.find({
        where: { plant_code: decoded.plant_code },
        select: ['process_id', 'process_name'],
      });

      const startAt = new Date(`${input.date}T01:00:00Z`);
      // const endAt = new Date(`${input.date}T00:00:00Z`);
      // endAt.setHours(endAt.getHours() + 24);
      const data = [];
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(startAt);
        const timeSlot = new Date(startAt);
        if (process.platform !== 'win32')
          timeSlot.setHours(timeSlot.getHours() + 7);
        timestamp.setHours(timestamp.getHours() + i);
        timeSlot.setHours(timeSlot.getHours() + i);
        for (const processItem of allProcesses) {
          const timeSlotString = `${timeSlot.getHours().toString().padStart(2, '0')}:00 - ${(timeSlot.getHours() + 1).toString().padStart(2, '0')}:00`;
          data.push({
            datetime: timestamp,
            time_slot: timeSlotString,
            shift:
              timeSlot.getHours() >= 8 && timeSlot.getHours() < 20
                ? 'DAY'
                : 'NIGHT',
            process_id: processItem.process_id,
            process_name: processItem.process_name,
            ng_quantity:
              summary.find(
                (item) =>
                  item.process_id === processItem.process_id &&
                  item.time_slot === timeSlotString,
              )?.ng_quantity ?? 0,
          });
        }
      }

      // //! Check Cache
      // await this.cacheManager.set(cacheKey, data, cacheTTL);
      // //! ./Check Cache

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects graph summary by date',
        // data: [startAt, endAt],
        data: data,
        // data: data.filter((item) => item.ng_quantity != 0),
        // data: summary,
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

  async graphSummaryByDateRange(
    input: FindByDateRangeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      // //! Check Cache
      // const cacheKey = `/toolbox/v1/defects-logging/graph-summary-by-date-range_${input.start_date}_${input.end_date}`;
      // // console.log(cacheKey);
      // const cacheTTL = 30 * 1000; // 30 seconds
      // const cacheValue = await this.cacheManager.get(cacheKey);
      // if (cacheValue !== undefined) {
      //   return {
      //     status: 'success',
      //     statusCode: 200,
      //     message: 'Data (Cache)',
      //     data: cacheValue as any[],
      //   };
      // }
      // //! ./Check Cache

      const startDatetime = new Date(`${input.start_date}T01:00:00.000Z`);
      const endDatetime = new Date(`${input.end_date}T01:00:00.000Z`);
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

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        })
        .leftJoin('tb_processes', 't2', 't1.process_id = t2.process_id')
        .select(
          `t1.datetime,t1.process_id,t2.process_name
          ,to_char(t1.datetime, 'YYYY-MM-DD') as date
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI'))  as time_slot
          ,(case when extract(hour from t1.datetime) >= 8 and extract(hour from t1.datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,sum(t1.ng_quantity) as ng_quantity`,
        )
        .groupBy('t1.datetime,t1.process_id,t2.process_name')
        .orderBy('t1.datetime', 'ASC')
        .getRawMany();

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo2',
      //   data: results.filter((item) => item.process === 'ASSEMBLY'),
      // };

      const summary = results.reduce((acc, cur) => {
        const allProcessAndDate = acc.map(
          (item) => `${item.process_id}_${new Date(item.datetime).getTime()}`,
        );
        if (
          !allProcessAndDate.includes(
            `${cur.process_id}_${new Date(cur.datetime).getTime()}`,
          )
        ) {
          return [
            ...acc,
            {
              datetime: cur.datetime,
              date: cur.date,
              time_slot: cur.time_slot,
              shift: cur.shift,
              process_id: cur.process_id,
              process_name: cur.process_name,
              ng_quantity: Number(cur.ng_quantity),
            },
          ];
        }

        return acc.map((item) => {
          if (
            item.process_id === cur.process_id &&
            new Date(item.datetime).getTime() ===
              new Date(cur.datetime).getTime()
          ) {
            return {
              ...item,
              ng_quantity: item.ng_quantity + Number(cur.ng_quantity),
            };
          }

          return item;
        });
      }, []);

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo3',
      //   data: summary,
      // };

      // : { process_id: string; process_name: string }[]
      const allProcesses = await this.processRepository.find({
        where: { plant_code: decoded.plant_code },
        select: ['process_id', 'process_name'],
      });

      const startAt = new Date(`${input.start_date}T01:00:00Z`);
      // const endAt = new Date(`${input.end_date}T00:00:00Z`);
      // endAt.setHours(endAt.getHours() + 24);

      const data = [];
      for (let i = 0; i < 100000; i++) {
        const timestamp = new Date(startAt);
        const timeSlot = new Date(startAt);
        if (process.platform !== 'win32') {
          timeSlot.setHours(timeSlot.getHours() + 7);
        }
        timestamp.setHours(timestamp.getHours() + i);
        const dateString = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')}`;
        timeSlot.setHours(timeSlot.getHours() + i);
        for (const processItem of allProcesses) {
          const timeSlotString = `${timeSlot.getHours().toString().padStart(2, '0')}:00 - ${(timeSlot.getHours() + 1).toString().padStart(2, '0')}:00`;
          data.push({
            datetime: timestamp,
            time_slot: timeSlotString,
            shift:
              timeSlot.getHours() >= 8 && timeSlot.getHours() < 20
                ? 'DAY'
                : 'NIGHT',
            process_id: processItem.process_id,
            process_name: processItem.process_name,
            ng_quantity:
              summary.find(
                (item) =>
                  // item.process === process && item.time_slot === timeSlotString,
                  item.process_id === processItem.process_id &&
                  item.date === dateString &&
                  item.time_slot === timeSlotString,
              )?.ng_quantity ?? 0,
          });
        }
        if (timestamp.getTime() >= endDatetime.getTime()) break;
      }

      // //! Check Cache
      // await this.cacheManager.set(cacheKey, data, cacheTTL);
      // //! ./Check Cache

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects graph summary by date',
        // data: [startAt, endAt],
        data: data,
        // data: summary,
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

  async findTopRankByDate(
    input: FindTopRankDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      let startDatetime: Date;
      let endDatetime: Date;
      if (input.shift == 'DAY') {
        startDatetime = new Date(`${input.date}T01:00:00Z`);
        endDatetime = new Date(`${input.date}T12:00:00Z`);
      } else if (input.shift == 'NIGHT') {
        startDatetime = new Date(`${input.date}T13:00:00Z`);
        endDatetime = new Date(`${input.date}T00:00:00Z`);
        endDatetime.setHours(endDatetime.getHours() + 24);
      } else {
        startDatetime = new Date(`${input.date}T01:00:00Z`);
        endDatetime = new Date(`${input.date}T00:00:00Z`);
        endDatetime.setHours(endDatetime.getHours() + 24);
      }

      // : { process_id: string; process_name: string }[]
      const allProcesses = await this.processRepository.find({
        where: { plant_code: decoded.plant_code },
        select: ['process_id', 'process_name'],
      });

      const filterProcess =
        input.process_id === 'ALL'
          ? allProcesses.map((item) => item.process_id)
          : [input.process_id];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.process_id in (:...processes)', {
          processes: filterProcess,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        })
        .leftJoin('tb_ng_cases', 't2', 't1.case_id = t2.case_id')
        .select('t1.case_id,t2.case_name')
        .addSelect('SUM(t1.ng_quantity)::int as ng_quantity')
        .groupBy('t1.case_id,t2.case_name')
        .orderBy('ng_quantity', 'DESC')
        // .orderBy('case_name', 'ASC')
        .take(input.ranking)
        .getRawMany();

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects summary by datetime range',
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

  async findTopRankByDateRange(
    input: FindTopRankDateRangeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const startDatetime = new Date(`${input.start_date}T01:00:00Z`);
      const endDatetime = new Date(`${input.end_date}T01:00:00Z`);
      endDatetime.setHours(endDatetime.getHours() + 23);

      const allShiftDay = [];
      const allShiftNight = [];

      for (let i = 0; i < 10000; i++) {
        const timestamp = new Date(startDatetime);
        timestamp.setHours(timestamp.getHours() + i);
        if (timestamp.getHours() >= 8 && timestamp.getHours() < 20) {
          allShiftDay.push(timestamp);
        } else {
          allShiftNight.push(timestamp);
        }
        if (timestamp.getTime() >= endDatetime.getTime()) break;
      }

      // : { process_id: string; process_name: string }[]
      const allProcesses = await this.processRepository.find({
        where: { plant_code: decoded.plant_code },
        select: ['process_id', 'process_name'],
      });

      const filterProcess =
        input.process_id === 'ALL'
          ? allProcesses.map((item) => item.process_id)
          : [input.process_id];

      const filterShift =
        input.shift === 'DAY'
          ? allShiftDay
          : input.shift === 'NIGHT'
            ? allShiftNight
            : [...allShiftDay, ...allShiftNight];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.process_id in (:...process)', { process: filterProcess })
        .andWhere('t1.datetime in (:...datetime)', { datetime: filterShift })
        // .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
        //   start_datetime: startDatetime,
        //   end_datetime: endDatetime,
        // })
        .leftJoin('tb_ng_cases', 't2', 't1.case_id = t2.case_id')
        .select('t1.case_id,t2.case_name')
        .addSelect('SUM(t1.ng_quantity)::int as ng_quantity')
        .groupBy('t1.case_id,t2.case_name')
        .orderBy('ng_quantity', 'DESC')
        // .orderBy('case_name', 'ASC')
        .take(input.ranking)
        .getRawMany();

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects summary by datetime range',
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

  async update(
    input: UpdateDefectsDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const checkPartExists = await this.partRepository.findOne({
        where: { part_id: input.part_id, plant_code: decoded.plant_code },
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
        defects_type: input.defects_type,
        process_id: input.process_id,
        part_id: input.part_id,
        case_id: input.case_id,
        ng_quantity: input.ng_quantity,
        //! Not required
        machine_id: !Boolean(input.machine_id) ? null : input.machine_id,
        operator_id: !Boolean(input.operator_id) ? null : input.operator_id,
        production_quantity: input.production_quantity ?? 0,
        rework_quantity: input.rework_quantity ?? 0,
        scrap_quantity: input.scrap_quantity ?? 0,
        claim_supplier_quantity: input.claim_supplier_quantity ?? 0,
        scrap_approval_sheet_no: input.scrap_approval_sheet_no ?? '',
        car_no: input.car_no ?? '',
        image: null,
        solve_problem: input.solve_problem ?? '',
        remarks: input.remarks ?? '',
      };

      // /*
      if (
        input.image !== '' &&
        input.image != 'DELETE' &&
        input.image !== null
      ) {
        const filename = `${input.case_id}_${this.randomString(8)}_${Date.now()}.png`;
        const remotePath = `/CoDE_Data/toolbox/docs/v1/${filename}`;
        const isUploaded = await FtpUploadFileFromBase64(
          // input.image,
          input.image.replace(/^data:image\/\w+;base64,/, ''),
          remotePath,
        );
        // console.log('isUploaded', isUploaded);

        // https://sncservices.sncformer.com/data/toolbox/docs/v1/test.png
        if (isUploaded)
          record.image = `https://sncservices.sncformer.com/data/toolbox/docs/v1/${filename}`;
      }
      // */

      // if (record.image === null && input.image != 'DELETE') delete record.image;
      if (record.image === null) delete record.image;
      const updated = await this.defectsLoggingRepository.update(
        { defects_log_id: input.defects_log_id },
        record,
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Defect updated successfully',
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

  async delete(input: FindDefectsDto): Promise<TServiceResponse> {
    try {
      /*
      if (input.image !== '' && input.image !== null) {
        const filename = `${input.ng_id}_${input.datetime}_${input.part_code}_${Date.now()}.png`;
        const remotePath = `/CoDE_Data/toolbox/docs/v1/${filename}`;
        const isUploaded = await FtpUploadFileFromBase64(
          input.image,
          remotePath,
        );
        // https://sncservices.sncformer.com/data/toolbox/docs/v1/test.png
        if (isUploaded)
          record.image = `https://sncservices.sncformer.com/data/toolbox/docs/v1/${filename}`;
      }
        */

      const deleted = await this.defectsLoggingRepository.delete({
        defects_log_id: input.defects_log_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defect deleted successfully',
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
