import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Patch,
  Body,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProcessesService } from './processes.service';
import { TJwtPayload } from 'src/types';
import {
  CreateProcessDto,
  UpdateProcessDto,
  UpdateProcessOrderDto,
  FindProcessDto,
} from './dto';

@Controller('processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @Post()
  async create(
    @Body() body: CreateProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.processesService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.processesService.findAll(req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get('info')
  async findOne(@Query() query: FindProcessDto, @Res() res: Response) {
    const result = await this.processesService.findOne(query);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(@Body() body: UpdateProcessDto, @Res() res: Response) {
    const result = await this.processesService.update(body);
    return res.status(result.statusCode).json(result);
  }

  @Patch('order')
  async updateOrder(@Body() body: UpdateProcessOrderDto, @Res() res: Response) {
    const result = await this.processesService.updateOrder(body);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindProcessDto, @Res() res: Response) {
    const result = await this.processesService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
