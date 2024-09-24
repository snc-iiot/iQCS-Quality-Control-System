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
  FindByProcessDateRangeDto,
  FindTopRankDateRangeDto,
  CreateDefectsMoreNgCasesDto,
  FindPartByDateRangeDto,
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
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz_-';
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
        case_id: !Boolean(input.case_id) ? null : input.case_id,
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

  async createMoreNgCase(
    input: CreateDefectsMoreNgCasesDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    // return {
    //   status: 'success',
    //   statusCode: 200,
    //   message: 'Demo',
    //   data: [{ input, decoded }],
    // };
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

      let isUploaded = false;
      const filename = `${this.randomString(20)}_${Date.now()}.png`;
      // /*
      if (input.image !== '' && input.image !== null) {
        const remotePath = `/CoDE_Data/toolbox/docs/v1/${filename}`;
        isUploaded =
          ((await FtpUploadFileFromBase64(
            // input.image,
            input.image.replace(/^data:image\/\w+;base64,/, ''),
            remotePath,
          )) as boolean) ?? false;
        // console.log('isUploaded', isUploaded);
        // https://sncservices.sncformer.com/data/toolbox/docs/v1/test.png
        // if (isUploaded)
        //   record.image = `https://sncservices.sncformer.com/data/toolbox/docs/v1/${filename}`;
      }
      // */

      if (input.defects.length === 0) {
        const record = {
          datetime: input.datetime,
          defects_type: input.defects_type,
          process_id: input.process_id,
          part_id: input.part_id,
          case_id: null,
          ng_quantity: 0,
          //! Not required
          machine_id: !Boolean(input.machine_id) ? null : input.machine_id,
          operator_id: !Boolean(input.operator_id) ? null : input.operator_id,
          production_quantity: input.production_quantity ?? 0,
          rework_quantity: input.rework_quantity ?? 0,
          scrap_quantity: input.scrap_quantity ?? 0,
          claim_supplier_quantity: input.claim_supplier_quantity ?? 0,
          scrap_approval_sheet_no: input.scrap_approval_sheet_no ?? '',
          car_no: input.car_no ?? '',
          image: !isUploaded
            ? null
            : `https://sncservices.sncformer.com/data/toolbox/docs/v1/${filename}`,
          solve_problem: input.solve_problem ?? '',
          remarks: input.remarks ?? '',
          creator_id: decoded.user_id,
          plant_code: decoded.plant_code,
        };
        const created = await this.defectsLoggingRepository.save(record);
      } else {
        const records = input.defects.map((item, index) => ({
          datetime: input.datetime,
          defects_type: input.defects_type,
          process_id: input.process_id,
          part_id: input.part_id,
          case_id: item.case_id,
          ng_quantity: item.ng_quantity,
          //! Not required
          machine_id: !Boolean(input.machine_id) ? null : input.machine_id,
          operator_id: !Boolean(input.operator_id) ? null : input.operator_id,
          production_quantity:
            index == 0 ? (input.production_quantity ?? 0) : 0,
          rework_quantity: input.rework_quantity ?? 0,
          scrap_quantity: input.scrap_quantity ?? 0,
          claim_supplier_quantity: input.claim_supplier_quantity ?? 0,
          scrap_approval_sheet_no: input.scrap_approval_sheet_no ?? '',
          car_no: input.car_no ?? '',
          image: !isUploaded
            ? null
            : `https://sncservices.sncformer.com/data/toolbox/docs/v1/${filename}`,
          solve_problem: input.solve_problem ?? '',
          remarks: input.remarks ?? '',
          creator_id: decoded.user_id,
          plant_code: decoded.plant_code,
        }));

        const created = await this.defectsLoggingRepository.save(records);
      }

      return {
        status: 'success',
        statusCode: 201,
        message: 'Defects created successfully',
        data: [],
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
      const cacheKey = `/iqcs/dev/v1/defects-logging/raw-data-by-datetime-range_${input.start_datetime}_${input.end_datetime}_${decoded.plant_code}`;
      // console.log(cacheKey);
      const cacheTTL = 5 * 1000; // 5 seconds
      const cacheValue = await this.cacheManager.get(cacheKey);
      if (cacheValue !== undefined) {
        return {
          status: 'success',
          statusCode: 200,
          message: 'Data (Cache)',
          data: cacheValue as any[],
        };
      }
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
        .leftJoin('tb_machines', 't5', 't1.machine_id = t5.machine_id')
        .leftJoin('tb_operators', 't6', 't1.operator_id = t6.operator_id')
        .leftJoin(
          'vw_update_prices',
          't7',
          't1.part_id=t7.part_id and t1.plant_code=t7.plant_code and t1.datetime between t7.start_effective_date and t7.end_effective_date',
        )
        .select(
          `t1.*
          ,concat(to_char(t1.datetime, 'HH24:MI'), ' - ', to_char(t1.datetime + interval '1 hour', 'HH24:MI'))  as time_slot
          ,(case when extract(hour from t1.datetime) >= 8 and extract(hour from t1.datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,t2.case_name,t2.description AS ng_description,t3.name AS creator_name,t4.part_code,t4.part_name,t4.customers
          ,t5.machine_no,t5.machine_name,t6.employee_id,t6.operator_name
          ,coalesce(t7.price,t4.price,0) as price,coalesce(t7.ng_price,t4.price * 1,0) as ng_price,coalesce(t7.scrap_price,t4.price * 1,0) as scrap_price,coalesce(t7.rework_price,t4.price * 0.5,0) as rework_price`,
        )
        .orderBy('t1.created_at', 'DESC')
        .getRawMany();

      const data = results.map((item) => ({
        ...item,
        // price: 10,
        // ng_price: 10,
        // scrap_price: 10,
        // rework_price: 5,
        price: Number(item.price),
        ng_price: Number(item.ng_price),
        scrap_price: Number(item.scrap_price),
        rework_price: Number(item.rework_price),
      }));

      //! Check Cache
      await this.cacheManager.set(cacheKey, results, cacheTTL);
      //! ./Check Cache

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects raw data by datetime range',
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

  async summaryByDatetimeRange(
    input: FindByDatetimeRangeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        .andWhere('t1.ng_quantity > 0')
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

      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        .andWhere('t1.ng_quantity > 0')
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
      //! Check Cache
      const cacheKey = `/iqcs/dev/v1/defects-logging/graph-summary-by-date_${input.date}_${input.defects_type}_${decoded.plant_code}`;
      // console.log(cacheKey);
      const cacheTTL = 30 * 1000; // 30 seconds
      const cacheValue = await this.cacheManager.get(cacheKey);
      if (cacheValue !== undefined) {
        return {
          status: 'success',
          statusCode: 200,
          message: 'Data (Cache)',
          data: cacheValue as any[],
        };
      }
      //! ./Check Cache

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

      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        .andWhere('t1.ng_quantity > 0')
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

      //! Check Cache
      await this.cacheManager.set(cacheKey, data, cacheTTL);
      //! ./Check Cache

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
      //! Check Cache
      const cacheKey = `/iqcs/dev/v1/defects-logging/graph-summary-by-date-range_${input.start_date}_${input.end_date}_${input.defects_type}_${decoded.plant_code}`;
      // console.log(cacheKey);
      const cacheTTL = 30 * 1000; // 30 seconds
      const cacheValue = await this.cacheManager.get(cacheKey);
      if (cacheValue !== undefined) {
        return {
          status: 'success',
          statusCode: 200,
          message: 'Data (Cache)',
          data: cacheValue as any[],
        };
      }
      //! ./Check Cache

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

      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        .andWhere('t1.ng_quantity > 0')
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
        timeSlot.setHours(timeSlot.getHours() + i);
        const dateString1 = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')}`;
        const dateString2 = `${timeSlot.getFullYear()}-${(timeSlot.getMonth() + 1).toString().padStart(2, '0')}-${timeSlot.getDate().toString().padStart(2, '0')}`;
        const dateString =
          process.platform !== 'win32' ? dateString2 : dateString1;
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

      //! Check Cache
      await this.cacheManager.set(cacheKey, data, cacheTTL);
      //! ./Check Cache

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

  async graphSummaryPartDefectsByDateRange(
    input: FindByProcessDateRangeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Check Cache
      const cacheKey = `/iqcs/dev/v1/defects-logging/graph-summary-part-by-date-range_${input.start_date}_${input.end_date}_${input.process_id}_${input.defects_type}_${decoded.plant_code}`;
      // console.log(cacheKey);
      const cacheTTL = 30 * 1000; // 30 seconds
      const cacheValue = await this.cacheManager.get(cacheKey);
      if (cacheValue !== undefined) {
        return {
          status: 'success',
          statusCode: 200,
          message: 'Data (Cache)',
          data: cacheValue as any[],
        };
      }
      //! ./Check Cache

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

      const allProcesses = await this.processRepository.find({
        where: { plant_code: decoded.plant_code },
        select: ['process_id', 'process_name'],
      });

      const filterProcess =
        input.process_id === 'ALL'
          ? allProcesses.map((item) => item.process_id)
          : [input.process_id];

      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        // .andWhere('t1.ng_quantity > 0')
        // .andWhere('t1.process_id = :process_id', {
        //   process_id: input.process_id,
        // })
        .andWhere('t1.process_id in (:...processes)', {
          processes: filterProcess,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        })
        // .leftJoin('tb_processes', 't2', 't1.process_id = t2.process_id')
        .leftJoin('tb_part_material', 't2', 't1.part_id = t2.part_id')
        .leftJoin('tb_ng_cases', 't3', 't1.case_id = t3.case_id')
        .select(
          `t1.process_id,t1.part_id,t2.part_code,t2.part_name
          --,to_char(t1.datetime, 'YYYY-MM-DD') as date
          ,(case when extract(hour from t1.datetime) >= 8 and extract(hour from t1.datetime) < 20 then 'DAY' else 'NIGHT' end) as shift
          ,sum(t1.production_quantity) as production_quantity
          ,sum(t1.ng_quantity) as ng_quantity
          ,array_agg(
            jsonb_build_object(
                'case_id', t1.case_id,
                'case_name', t3.case_name,
                'ng_quantity', t1.ng_quantity
              )
          ) as details`,
        )
        .groupBy('t1.process_id,t1.part_id,t2.part_code,t2.part_name,shift')
        // .orderBy('date', 'ASC')
        .orderBy('shift', 'ASC')
        .getRawMany();

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo2',
      //   data: results,
      //   // data: results.filter((item) => item.process === 'ASSEMBLY'),
      // };

      const summary = results.reduce((acc, cur) => {
        const allProcessAndDate = acc.map(
          (item) => `${item.part_id}_${item.shift}`,
        );
        if (!allProcessAndDate.includes(`${cur.part_id}_${cur.shift}`)) {
          return [
            ...acc,
            {
              // date: cur.date,
              shift: cur.shift,
              process_id: cur.process_id,
              part_id: cur.part_id,
              part_code: cur.part_code,
              part_name: cur.part_name,
              // process_name: cur.process_name,
              production_quantity: Number(cur.production_quantity),
              ng_quantity: Number(cur.ng_quantity),
              details: cur.details,
            },
          ];
        }

        return acc.map(
          (item: {
            part_id: string;
            shift: string;
            production_quantity: number;
            ng_quantity: number;
          }) => {
            if (item.part_id === cur.part_id && item.shift === cur.shift) {
              return {
                ...item,
                production_quantity:
                  item.production_quantity + Number(cur.production_quantity),
                ng_quantity: item.ng_quantity + Number(cur.ng_quantity),
              };
            }

            return item;
          },
        );
      }, []);

      // Sum details
      const summaryDetails = summary.map(
        (item: {
          production_quantity: number;
          ng_quantity: number;
          details: {
            case_id: string;
            case_name: string;
            ng_quantity: number;
          }[];
        }) => {
          const details = item.details
            .filter((x) => Boolean(x.case_id))
            .reduce((acc, cur) => {
              const allCase = acc.map(
                (item: { case_id: string }) => item.case_id,
              );
              if (!allCase.includes(cur.case_id)) {
                return [
                  ...acc,
                  {
                    case_id: cur.case_id,
                    case_name: cur.case_name,
                    ng_quantity: Number(cur.ng_quantity),
                  },
                ];
              }

              return acc.map(
                (item: { case_id: string; ng_quantity: number }) => {
                  if (item.case_id === cur.case_id) {
                    return {
                      ...item,
                      ng_quantity: item.ng_quantity + cur.ng_quantity,
                    };
                  }

                  return item;
                },
              );
            }, []);

          return {
            ...item,
            defects_percentage:
              ((item.production_quantity - item.ng_quantity) * 100) /
              item.production_quantity,
            details: details,
          };
        },
      );

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo3',
      //   data: summary,
      // };

      //! Check Cache
      await this.cacheManager.set(cacheKey, summaryDetails, cacheTTL);
      //! ./Check Cache

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects graph summary part by date range',
        // data: [startAt, endAt],
        // data: data,
        // data: summary,
        data: summaryDetails,
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

  async partSummaryAllPlantByDateRange(
    input: FindByDateRangeDto,
  ): Promise<TServiceResponse> {
    try {
      //! Check Cache
      const cacheKey = `/iqcs/dev/v1/defects-logging/parts-summary-all-plant_${input.start_date}_${input.end_date}_${input.defects_type ?? 'ALL'}`;
      // console.log(cacheKey);
      const cacheTTL = 30 * 1000; // 30 seconds
      const cacheValue = await this.cacheManager.get(cacheKey);
      if (cacheValue !== undefined) {
        return {
          status: 'success',
          statusCode: 200,
          message: 'Data (Cache)',
          data: cacheValue as any[],
        };
      }
      //! ./Check Cache

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

      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        })
        // .leftJoin('tb_processes', 't2', 't1.process_id = t2.process_id')
        .leftJoin('tb_part_material', 't2', 't1.part_id = t2.part_id')
        .leftJoin('tb_processes', 't3', 't1.process_id = t3.process_id')
        .leftJoin('tb_ng_cases', 't4', 't1.case_id = t4.case_id')
        .select(
          `t1.plant_code,t1.process_id,t3.process_name,t3.process_description,t1.part_id,t2.part_code,t2.part_name
          ,sum(t1.production_quantity) as production_quantity
          ,sum(t1.ng_quantity) as ng_quantity
          /*,array_agg(
            jsonb_build_object(
                'case_id', t1.case_id,
                'case_name', t4.case_name,
                'ng_quantity', t1.ng_quantity
              )
          ) as details*/`,
        )
        .groupBy(
          't1.plant_code,t1.process_id,t3.process_name,t3.process_description,t1.part_id,t2.part_code,t2.part_name',
        )
        // .orderBy('date', 'ASC')
        .orderBy('plant_code', 'ASC')
        .orderBy('process_id', 'ASC')
        .getRawMany();

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo2',
      //   data: results,
      //   // data: results.filter((item) => item.process === 'ASSEMBLY'),
      // };

      const summary = results.reduce((acc, cur) => {
        const allProcessAndDate = acc.map(
          (item) => `${item.part_id}_${item.plant_code}`,
        );
        if (!allProcessAndDate.includes(`${cur.part_id}_${cur.plant_code}`)) {
          return [
            ...acc,
            {
              // date: cur.date,
              shift: cur.shift,
              process_id: cur.process_id,
              process_name: cur.process_name,
              process_description: cur.process_description,
              part_id: cur.part_id,
              part_code: cur.part_code,
              part_name: cur.part_name,
              plant_code: cur.plant_code,
              // process_name: cur.process_name,
              production_quantity: Number(cur.production_quantity),
              ng_quantity: Number(cur.ng_quantity),
              // details: cur.details,
            },
          ];
        }

        return acc.map(
          (item: {
            part_id: string;
            production_quantity: number;
            ng_quantity: number;
          }) => {
            if (item.part_id === cur.part_id) {
              return {
                ...item,
                production_quantity:
                  item.production_quantity + Number(cur.production_quantity),
                ng_quantity: item.ng_quantity + Number(cur.ng_quantity),
              };
            }

            return item;
          },
        );
      }, []);

      // Sum details
      /*
      const summaryDetails = summary.map(
        (item: {
          production_quantity: number;
          ng_quantity: number;
          details: {
            case_id: string;
            case_name: string;
            ng_quantity: number;
          }[];
        }) => {
          const details = item.details
            .filter((x) => Boolean(x.case_id))
            .reduce((acc, cur) => {
              const allCase = acc.map(
                (item: { case_id: string }) => item.case_id,
              );
              if (!allCase.includes(cur.case_id)) {
                return [
                  ...acc,
                  {
                    case_id: cur.case_id,
                    case_name: cur.case_name,
                    ng_quantity: Number(cur.ng_quantity),
                  },
                ];
              }

              return acc.map(
                (item: { case_id: string; ng_quantity: number }) => {
                  if (item.case_id === cur.case_id) {
                    return {
                      ...item,
                      ng_quantity: item.ng_quantity + cur.ng_quantity,
                    };
                  }

                  return item;
                },
              );
            }, []);

          return {
            ...item,
            defects_percentage:
              100 -
              ((item.production_quantity - item.ng_quantity) * 100) /
                item.production_quantity,
            details: details,
          };
        },
      );
      */

      //! Calculate Defects Percentage
      const summaryDetails = summary.map(
        (item: { production_quantity: number; ng_quantity: number }) => {
          return {
            ...item,
            defects_percentage:
              100 -
              ((item.production_quantity - item.ng_quantity) * 100) /
                item.production_quantity,
          };
        },
      );

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo3',
      //   data: summary,
      // };

      //! Check Cache
      await this.cacheManager.set(cacheKey, summaryDetails, cacheTTL);
      //! ./Check Cache

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects graph summary part all plant by date range',
        // data: [startAt, endAt],
        // data: data,
        // data: summary,
        data: summaryDetails,
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

  async partSummaryAllPlantByDateRange2(
    input: FindByDateRangeDto,
  ): Promise<TServiceResponse> {
    try {
      //! Check Cache
      const cacheKey = `/iqcs/dev/v1/defects-logging/parts-summary-all-plant_${input.start_date}_${input.end_date}_${input.defects_type ?? 'ALL'}`;
      // console.log(cacheKey);
      const cacheTTL = 30 * 1000; // 30 seconds
      const cacheValue = await this.cacheManager.get(cacheKey);
      if (cacheValue !== undefined) {
        return {
          status: 'success',
          statusCode: 200,
          message: 'Data (Cache)',
          data: cacheValue as any[],
        };
      }
      //! ./Check Cache

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

      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const allProcesses = await this.processRepository.find({
        select: [
          'process_id',
          'process_name',
          'process_description',
          'process_order',
          'process_color',
          'plant_code',
        ],
      });

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        })
        // .leftJoin('tb_processes', 't2', 't1.process_id = t2.process_id')
        .leftJoin('tb_part_material', 't2', 't1.part_id = t2.part_id')
        // .leftJoin('tb_processes', 't3', 't1.plant_code = t3.plant_code')
        .leftJoin('tb_ng_cases', 't4', 't1.case_id = t4.case_id')
        .select(
          `t1.plant_code,t1.part_id,t2.part_code,t2.part_name,t2.processes
          ,sum(t1.production_quantity) as production_quantity
          ,sum(t1.ng_quantity) as ng_quantity
          ,array_agg(
            jsonb_build_object(
                'case_id', t1.case_id,
                'case_name', t4.case_name,
                'ng_quantity', t1.ng_quantity,
                'processes', t4.processes
              )
          ) as details`,
        )
        .groupBy(
          't1.plant_code,t1.part_id,t2.part_code,t2.part_name,t2.processes',
        )
        // .orderBy('date', 'ASC')
        .orderBy('plant_code', 'ASC')
        .orderBy('part_id', 'ASC')
        .getRawMany();

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo2',
      //   data: results,
      //   // data: results.filter((item) => item.process === 'ASSEMBLY'),
      // };

      const summary = results.reduce((acc, cur) => {
        const allProcessAndDate = acc.map(
          (item: { part_id: string; plant_code: string }) =>
            `${item.part_id}_${item.plant_code}`,
        );
        if (!allProcessAndDate.includes(`${cur.part_id}_${cur.plant_code}`)) {
          return [
            ...acc,
            {
              // date: cur.date,
              shift: cur.shift,
              // process_id: cur.process_id,
              // process_name: cur.process_name,
              // process_description: cur.process_description,
              part_id: cur.part_id,
              part_code: cur.part_code,
              part_name: cur.part_name,
              processes: cur.processes.map((x: string) => {
                return allProcesses.find((y) => y.process_id === x);
              }),
              plant_code: cur.plant_code,
              production_quantity: Number(cur.production_quantity),
              ng_quantity: Number(cur.ng_quantity),
              details: cur.details,
            },
          ];
        }

        return acc.map(
          (item: {
            part_id: string;
            production_quantity: number;
            ng_quantity: number;
          }) => {
            if (item.part_id === cur.part_id) {
              return {
                ...item,
                production_quantity:
                  item.production_quantity + Number(cur.production_quantity),
                ng_quantity: item.ng_quantity + Number(cur.ng_quantity),
              };
            }

            return item;
          },
        );
      }, []);

      // Sum details
      const summaryDetails = summary.map(
        (item: {
          production_quantity: number;
          ng_quantity: number;
          details: {
            case_id: string;
            case_name: string;
            ng_quantity: number;
            processes: any[];
          }[];
        }) => {
          const details = item.details
            .filter((x) => Boolean(x.case_id))
            .reduce((acc, cur) => {
              const allCase = acc.map(
                (item: { case_id: string }) => item.case_id,
              );
              if (!allCase.includes(cur.case_id)) {
                return [
                  ...acc,
                  {
                    case_id: cur.case_id,
                    case_name: cur.case_name,
                    processes: cur.processes,
                    ng_quantity: Number(cur.ng_quantity),
                  },
                ];
              }

              return acc.map(
                (item: { case_id: string; ng_quantity: number }) => {
                  if (item.case_id === cur.case_id) {
                    return {
                      ...item,
                      ng_quantity: item.ng_quantity + cur.ng_quantity,
                    };
                  }

                  return item;
                },
              );
            }, []);

          return {
            ...item,
            defects_percentage:
              100 -
              ((item.production_quantity - item.ng_quantity) * 100) /
                item.production_quantity,
            details: details,
          };
        },
      );

      //! Calculate Defects Percentage
      /*
      const summaryDetails = summary.map(
        (item: { production_quantity: number; ng_quantity: number }) => {
          return {
            ...item,
            defects_percentage:
              100 -
              ((item.production_quantity - item.ng_quantity) * 100) /
                item.production_quantity,
          };
        },
      );
      */

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo3',
      //   data: summary,
      // };

      //! Check Cache
      await this.cacheManager.set(cacheKey, summaryDetails, cacheTTL);
      //! ./Check Cache

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects graph summary part all plant by date range',
        // data: [startAt, endAt],
        // data: data,
        // data: summary,
        data: summaryDetails,
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

  async partDefectsDetailsByDateRange(
    input: FindPartByDateRangeDto,
  ): Promise<TServiceResponse> {
    try {
      //! Check Cache
      const cacheKey = `/iqcs/dev/v1/defects-logging/part-details_${input.start_date}_${input.end_date}_${input.part_id}_${input.process_id}_${input.defects_type ?? 'ALL'}`;
      // console.log(cacheKey);
      const cacheTTL = 30 * 1000; // 30 seconds
      const cacheValue = await this.cacheManager.get(cacheKey);
      if (cacheValue !== undefined) {
        return {
          status: 'success',
          statusCode: 200,
          message: 'Data (Cache)',
          data: cacheValue as any[],
        };
      }
      //! ./Check Cache

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

      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const allProcesses = await this.processRepository.find({
        select: [
          'process_id',
          'process_name',
          'process_description',
          'process_order',
          'process_color',
          'plant_code',
        ],
      });

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.part_id = :part_id', { part_id: input.part_id })
        .andWhere('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        .andWhere('t1.datetime BETWEEN :start_datetime AND :end_datetime', {
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        })
        .leftJoin('tb_part_material', 't2', 't1.part_id = t2.part_id')
        .leftJoin('tb_ng_cases', 't3', 't1.case_id = t3.case_id')
        .select(
          `t1.part_id,t2.part_code,t2.part_name,t1.case_id,t3.case_name
          ,sum(t1.production_quantity) as production_quantity
          ,sum(t1.ng_quantity) as ng_quantity`,
        )
        .groupBy('t1.part_id,t2.part_code,t2.part_name,t1.case_id,t3.case_name')
        .orderBy('ng_quantity', 'DESC')
        .getRawMany();

      //! Check Cache
      await this.cacheManager.set(cacheKey, results, cacheTTL);
      //! ./Check Cache

      return {
        status: 'success',
        statusCode: 200,
        message: 'Gert part defects details by date range',
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

      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        .andWhere('t1.ng_quantity > 0')
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
        .take(Number(input.ranking) || 10)
        .getRawMany();

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects summary by datetime range',
        data: results.slice(0, Number(input.ranking) || 10),
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

      const filterDefectsType = !['P', 'S'].includes(
        input.defects_type ?? 'ALL',
      )
        ? ['P', 'S']
        : [input.defects_type];

      const results = await this.defectsLoggingRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .andWhere('t1.defects_type in (:...defects_type)', {
          defects_type: filterDefectsType,
        })
        .andWhere('t1.ng_quantity > 0')
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
        // .take(3)
        .take(Number(input.ranking) || 10)
        .getRawMany();

      return {
        status: 'success',
        statusCode: 200,
        message: 'Defects summary by datetime range',
        data: results.slice(0, Number(input.ranking) || 10),
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
        case_id: !Boolean(input.case_id) ? null : input.case_id,
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
