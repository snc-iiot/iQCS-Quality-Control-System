import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Model } from './entities';
import { TServiceResponse, TJwtPayload } from 'src/types';
import {
  CreateModelDto,
  CreateModelsDto,
  FindModelDto,
  UpdateModelDto,
} from './dto';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  async create(
    input: CreateModelDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const modelExists = await this.modelRepository.find({
        where: { model_name: input.model_name, plant_code: decoded.plant_code },
        take: 1,
      });

      if (modelExists.length > 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Model already exists',
          data: [],
        };

      // const record = {
      //   model_name: input.model_name,
      //   model_description: input.model_description ?? '',
      // };

      await this.modelRepository.save({
        ...input,
        created_by: decoded.user_id,
        updated_by: decoded.user_id,
        plant_code: decoded.plant_code,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Model created successfully',
        data: [],
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

  async createModels(
    input: CreateModelsDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const allModelName = await this.modelRepository.find({
        where: { plant_code: decoded.plant_code },
      });

      const modelNameExists = allModelName.map((model) => model.model_name);

      const newModelName = input.data.filter(
        (model) => !modelNameExists.includes(model.model_name),
      );

      const records = newModelName.map((model) => ({
        model_name: model.model_name,
        model_description: model.model_description ?? '',
        plant_code: decoded.plant_code,
      }));

      const created = await this.modelRepository.save(records);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Models created successfully',
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
    input: UpdateModelDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const modelExists = await this.modelRepository.find({
        where: {
          model_name: input.model_name,
          plant_code: decoded.plant_code,
          model_id: Not(input.model_id),
        },
        take: 1,
      });

      if (modelExists.length > 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Model already exists',
          data: [],
        };

      const record = {
        model_name: input.model_name,
        model_description: input.model_description ?? '',
      };

      const updated = await this.modelRepository.update(
        { model_id: input.model_id },
        record,
      );

      return {
        status: 'success',
        statusCode: 200,
        message: 'Model updated successfully',
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
      const results = await this.modelRepository.find({
        where: { plant_code: decoded.plant_code },
        order: { created_at: 'DESC' },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'All Models',
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

  async findOne(input: FindModelDto): Promise<TServiceResponse> {
    try {
      const result = await this.modelRepository.find({
        where: { model_id: input.model_id },
        take: 1,
        order: { created_at: 'DESC' },
      });

      if (!result)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Model not found',
          data: [],
        };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Model information',
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

  async delete(input: FindModelDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.modelRepository.delete({
        model_id: input.model_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Model deleted successfully',
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
