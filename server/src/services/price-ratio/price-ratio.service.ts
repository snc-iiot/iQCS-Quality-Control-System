import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceRatio } from './entities';
import { TServiceResponse, TJwtPayload } from 'src/types';
import { SavePriceRatioDto, FindPriceRatioDto } from './dto';

@Injectable()
export class PriceRatioService {
  constructor(
    @InjectRepository(PriceRatio)
    private readonly priceRatioRepository: Repository<PriceRatio>,
  ) {}

  async save(
    input: SavePriceRatioDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const checkExisting = await this.priceRatioRepository.findOne({
        where: {
          plant_code: decoded.plant_code,
          effective_date: input.effective_date,
        },
        select: ['ratio_id'],
      });

      const isExisting = Boolean(checkExisting);
      if (isExisting) {
        const record = {
          // effective_date: input.effective_date,
          ng_ratio: input.ng_ratio ?? 1,
          scrap_ratio: input.scrap_ratio ?? 0,
          rework_ratio: input.rework_ratio ?? 0,
          remarks: input.remarks ?? '',
          // creator_id: decoded.user_id,
          // plant_code: decoded.plant_code,
        };
        const updated = await this.priceRatioRepository.update(
          {
            ratio_id: checkExisting.ratio_id,
          },
          record,
        );
      } else {
        const record = {
          effective_date: input.effective_date,
          ng_ratio: input.ng_ratio ?? 1,
          scrap_ratio: input.scrap_ratio ?? 0,
          rework_ratio: input.rework_ratio ?? 0,
          remarks: input.remarks ?? '',
          creator_id: decoded.user_id,
          plant_code: decoded.plant_code,
        };
        const created = await this.priceRatioRepository.save(record);
      }

      return {
        status: 'success',
        statusCode: 201,
        message: 'Price ratio saved successfully',
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

  async findAll(decoded: TJwtPayload): Promise<TServiceResponse> {
    try {
      const results = await this.priceRatioRepository.find({
        where: {
          plant_code: decoded.plant_code,
        },
        order: {
          effective_date: 'DESC',
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'All Price Ratios',
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

  async delete(input: FindPriceRatioDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.priceRatioRepository.delete({
        ratio_id: input.ratio_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Price ratio deleted successfully',
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
