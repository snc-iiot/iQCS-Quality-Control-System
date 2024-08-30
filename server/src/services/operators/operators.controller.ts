import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OperatorsService } from './operators.service';

import { TJwtPayload } from 'src/types';
import { CreateOperatorDto, UpdateOperatorDto, FindOperatorDto } from './dto';

@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Post()
  async create(
    @Body() body: CreateOperatorDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.operatorsService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.operatorsService.findAll(req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get('info')
  async findOne(@Query() query: FindOperatorDto, @Res() res: Response) {
    const result = await this.operatorsService.findOne(query);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(@Body() body: UpdateOperatorDto, @Res() res: Response) {
    const result = await this.operatorsService.update(body);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindOperatorDto, @Res() res: Response) {
    const result = await this.operatorsService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
