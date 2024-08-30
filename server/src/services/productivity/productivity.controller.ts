import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductivityService } from './productivity.service';
import { TJwtPayload } from 'src/types';
import {
  CreateProductivityDto,
  UpdateProductivityDto,
  FindProductivityDto,
  FindByDateDto,
  FindByDatetimeDto,
  FindByDatetimeRangeDto,
} from './dto/';

@Controller('productivity-logging')
export class ProductivityController {
  constructor(private readonly productivityService: ProductivityService) {}

  @Post()
  async create(
    @Body() body: CreateProductivityDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.productivityService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }
}
