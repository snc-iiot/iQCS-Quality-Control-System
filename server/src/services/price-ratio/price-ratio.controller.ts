import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PriceRatioService } from './price-ratio.service';
import { TJwtPayload } from 'src/types';
import { SavePriceRatioDto, FindPriceRatioDto } from './dto';

@Controller('price-ratios')
export class PriceRatioController {
  constructor(private readonly priceRatioService: PriceRatioService) {}

  @Post()
  async save(
    @Body() body: SavePriceRatioDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.priceRatioService.save(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.priceRatioService.findAll(req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindPriceRatioDto, @Res() res: Response) {
    const result = await this.priceRatioService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
