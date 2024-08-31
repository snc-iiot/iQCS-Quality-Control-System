import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePrice } from './entities';
import { PriceRatio } from 'src/services/price-ratio/entities';
import { TServiceResponse, TJwtPayload } from 'src/types';
import { SaveUpdatePriceDto, FindUpdatePriceDto } from './dto';

@Injectable()
export class UpdatePriceService {
  constructor(
    @InjectRepository(UpdatePrice)
    private readonly updatePriceRepository: Repository<UpdatePrice>,
    @InjectRepository(PriceRatio)
    private readonly priceRatioRepository: Repository<PriceRatio>,
  ) {}

  async save(
    input: SaveUpdatePriceDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const priceRatios = await this.priceRatioRepository
        .createQueryBuilder('pr')
        .select([
          // 'start_effective_date',
          // 'end_effective_date',
          'ng_ratio',
          'scrap_ratio',
          'rework_ratio',
          // 'remarks',
          // 'plant_code',
          // 'creator_id',
          // 'created_at',
          // 'updated_at',
        ])
        .from((subQuery) => {
          return subQuery
            .select([
              'pr.effective_date AS start_effective_date',
              "(COALESCE(LEAD(pr.effective_date) OVER (PARTITION BY pr.plant_code ORDER BY pr.effective_date), '2999-01-01'::date) + interval '-1 day')::date AS end_effective_date",
              'pr.ng_ratio',
              'pr.scrap_ratio',
              'pr.rework_ratio',
              'pr.remarks',
              'pr.plant_code',
              'pr.creator_id',
              'pr.created_at',
              'pr.updated_at',
            ])
            .from(PriceRatio, 'pr')
            .where('pr.plant_code = :plant_code', {
              plant_code: decoded.plant_code,
            });
        }, 't1')
        .where(
          `'${input.effective_date}' BETWEEN t1.start_effective_date AND t1.end_effective_date`,
        )
        .take(1)
        .getRawMany();

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo1',
      //   data: priceRatios,
      // };

      const ngRatio = Number(priceRatios?.[0]?.ng_ratio) || 1;
      const scrapRatio = Number(priceRatios?.[0]?.scrap_ratio) || 1;
      const reworkRatio = Number(priceRatios?.[0]?.rework_ratio) || 0.5;

      const checkExisting = await this.updatePriceRepository.findOne({
        where: {
          plant_code: decoded.plant_code,
          effective_date: input.effective_date,
          part_id: input.part_id,
        },
        select: ['update_price_id'],
      });

      const isExisting = Boolean(checkExisting);
      if (isExisting) {
        const record = {
          // effective_date: input.effective_date,
          price: input.price,
          ng_price: Number(input.price) * ngRatio,
          scrap_price: Number(input.price) * scrapRatio,
          rework_price: Number(input.price) * reworkRatio,
          remarks: input.remarks ?? '',
          // creator_id: decoded.user_id,
          // plant_code: decoded.plant_code,
        };
        const updated = await this.updatePriceRepository.update(
          {
            update_price_id: checkExisting.update_price_id,
          },
          record,
        );
      } else {
        const record = {
          effective_date: input.effective_date,
          part_id: input.part_id,
          price: input.price,
          ng_price: Number(input.price) * ngRatio,
          scrap_price: Number(input.price) * scrapRatio,
          rework_price: Number(input.price) * reworkRatio,
          remarks: input.remarks ?? '',
          creator_id: decoded.user_id,
          plant_code: decoded.plant_code,
        };
        const created = await this.updatePriceRepository.save(record);
      }

      return {
        status: 'success',
        statusCode: 201,
        message: 'Update price saved successfully',
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
      const results = await this.updatePriceRepository.find({
        where: {
          plant_code: decoded.plant_code,
        },
        order: {
          effective_date: 'DESC',
          part_id: 'DESC',
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'All Update Prices',
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

  async delete(input: FindUpdatePriceDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.updatePriceRepository.delete({
        update_price_id: input.update_price_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Update price deleted successfully',
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
