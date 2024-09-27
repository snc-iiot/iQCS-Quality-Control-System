import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Part } from './entities';
import { TServiceResponse, TJwtPayload } from 'src/types';
import {
  CreatePartDto,
  CreatePartsDto,
  UpdatePartDto,
  FindPartDto,
} from './dto';

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
  ) {}

  async create(
    input: CreatePartDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    // return {
    //   status: 'success',
    //   statusCode: 200,
    //   message: 'Demo0',
    //   data: [{ input, decoded }],
    // };
    try {
      //! Block duplicate part code
      const partExists = await this.partRepository.find({
        where: { part_code: input.part_code, plant_code: decoded.plant_code },
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
        sap_code: input.sap_code,
        part_code: input.part_code,
        part_name: input.part_name,
        model_id: input.model_id,
        part_description: input.part_description ?? '',
        processes: input.processes,
        price: input.price,
        type: input.type,
        customers: input.customers ?? [],
        plant_code: decoded.plant_code,
      };

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo1',
      //   data: [{ record }],
      // };
      const created = await this.partRepository.save(record);

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

  async createParts(
    input: CreatePartsDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    // return {
    //   status: 'success',
    //   statusCode: 200,
    //   message: 'Demo0',
    //   data: [{ input, decoded }],
    // };
    try {
      const allPartCode = await this.partRepository.find({
        where: { plant_code: decoded.plant_code },
      });

      const partCodeExists = allPartCode.map((part) => part.part_code);

      const newPartCode = input.data.filter(
        (part) => !partCodeExists.includes(part.part_code),
      );

      const records = newPartCode.map((part) => ({
        sap_code: part.sap_code ?? null,
        part_code: part.part_code,
        model_id: part.model_id,
        part_name: part.part_name,
        part_description: part.part_description ?? '',
        processes: part.processes,
        price: part.price ?? 0,
        customers: part.customers ?? [],
        type: part.type,
        plant_code: decoded.plant_code,
      }));

      const created = await this.partRepository.save(records);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Parts created successfully',
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

  async update(
    input: UpdatePartDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Block duplicate part code
      const partExists = await this.partRepository.find({
        where: {
          part_code: input.part_code,
          plant_code: decoded.plant_code,
          part_id: Not(input.part_id),
        },
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
        sap_code: input.sap_code,
        part_code: input.part_code,
        model_id: input.model_id,
        part_name: input.part_name,
        part_description: input.part_description ?? '',
        processes: input.processes,
        price: input.price,
        type: input.type,
        customers: input.customers ?? [],
      };
      const updated = await this.partRepository.update(
        { part_id: input.part_id },
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
      const results = await this.partRepository
        .createQueryBuilder('part')
        .leftJoin(
          'tb_model_material',
          'model',
          'part.model_id = model.model_id',
        )
        .select([
          'part.part_id as part_id',
          'part.sap_code as sap_code',
          'part.model_id as model_id',
          'part.part_code as part_code',
          'part.part_name as part_name',
          'part.part_description as part_description',
          'part.processes as processes',
          'part.price as price',
          'part.customers as customers',
          'part.plant_code as plant_code',
          'part.type as type',
          'part.created_at as created_at',
          'part.updated_at as updated_at',
        ])
        .addSelect('model.model_name', 'model_name')
        .orderBy('part.created_at', 'DESC')
        .getRawMany();

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
      const result = await this.partRepository
        .createQueryBuilder('t1')
        .leftJoin('tb_model_material', 't2', 't1.model_id = t2.model_id')
        .select(
          `t1.*, 
           t2.model_name, 
           t2.model_description`,
        )
        .where('t1.part_id = :part_id', { part_id: input.part_id })
        .orderBy('t1.created_at', 'DESC')
        .getRawOne();

      if (!result) {
        return {
          status: 'error',
          statusCode: 404,
          message: 'Part not found',
          data: [],
        };
      }

      return {
        status: 'success',
        statusCode: 200,
        message: 'Part information',
        data: result,
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
      const deleted = await this.partRepository.delete({
        part_id: input.part_id,
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
