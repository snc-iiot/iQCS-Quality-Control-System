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
import {
  CreateProductivityDto,
  UpdateProductivityDto,
  FindByDateDto,
  FindByDatetimeRangeDto,
  DeleteProductivityDto,
} from './dto';
import { TJwtPayload } from 'src/types';

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

  @Put()
  async update(
    @Body() body: UpdateProductivityDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.productivityService.update(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get('raw-data-by-datetime-range')
  async findRawDataByDatetimeRange(
    @Query() query: FindByDatetimeRangeDto,
    @Res() res: Response,
  ) {
    const result =
      await this.productivityService.findRawDataByDatetimeRange(query);
    return res.status(result.statusCode).json(result);
  }

  @Get('summary-by-datetime-range')
  async summaryByDatetimeRange(
    @Query() query: FindByDatetimeRangeDto,
    @Res() res: Response,
  ) {
    const result = await this.productivityService.summaryByDatetimeRange(query);
    return res.status(result.statusCode).json(result);
  }

  @Get('summary-by-date')
  async summaryByDate(@Query() query: FindByDateDto, @Res() res: Response) {
    const result = await this.productivityService.summaryByDate(query);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: DeleteProductivityDto, @Res() res: Response) {
    const result = await this.productivityService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
