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
import { DefectService } from './defects.service';
import { Request, Response } from 'express';
import {
  CreateDefectsDto,
  UpdateDefectsDto,
  FindByDateDto,
  FindTopRankDto,
  DeleteDefectsDto,
  FindByDatetimeRangeDto,
  FindByDateRangeDto,
  FindTopRankDateRangeDto,
} from './dto';
import { TJwtPayload } from 'src/types';

@Controller('defects-logging')
export class DefectController {
  constructor(private readonly defectService: DefectService) {}

  @Post()
  async create(
    @Body() body: CreateDefectsDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.defectService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(
    @Body() body: UpdateDefectsDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.defectService.update(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get('raw-data-by-datetime-range')
  async findRawDataByDatetimeRange(
    @Query() query: FindByDatetimeRangeDto,
    @Res() res: Response,
  ) {
    const result = await this.defectService.findRawDataByDatetimeRange(query);
    return res.status(result.statusCode).json(result);
  }

  @Get('summary-by-datetime-range')
  async summaryByDatetimeRange(
    @Query() query: FindByDatetimeRangeDto,
    @Res() res: Response,
  ) {
    const result = await this.defectService.summaryByDatetimeRange(query);
    return res.status(result.statusCode).json(result);
  }

  @Get('summary-by-date')
  async summaryByDate(@Query() query: FindByDateDto, @Res() res: Response) {
    const result = await this.defectService.summaryByDate(query);
    return res.status(result.statusCode).json(result);
  }

  @Get('graph-summary-by-date')
  async graphSummaryByDate(
    @Query() query: FindByDateDto,
    @Res() res: Response,
  ) {
    const result = await this.defectService.graphSummaryByDate(query);
    return res.status(result.statusCode).json(result);
  }

  @Get('top-rank-by-date')
  async findTopRankByDate(
    @Query() query: FindTopRankDto,
    @Res() res: Response,
  ) {
    const result = await this.defectService.findTopRankByDate(query);
    return res.status(result.statusCode).json(result);
  }

  @Get('graph-summary-by-date-range')
  async graphSummaryByDateRange(
    @Query() query: FindByDateRangeDto,
    @Res() res: Response,
  ) {
    const result = await this.defectService.graphSummaryByDateRange(query);
    return res.status(result.statusCode).json(result);
  }

  @Get('top-rank-by-date-range')
  async findTopRankByDateRange(
    @Query() query: FindTopRankDateRangeDto,
    @Res() res: Response,
  ) {
    const result = await this.defectService.findTopRankByDateRange(query);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: DeleteDefectsDto, @Res() res: Response) {
    const result = await this.defectService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
