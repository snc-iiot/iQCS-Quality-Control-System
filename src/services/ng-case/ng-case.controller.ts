import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Query,
  Res,
} from '@nestjs/common';
import { NgCaseService } from './ng-case.service';
import { query, Response } from 'express';
import { CreateNgCaseDto, UpdateNgCaseDto, FindNgCaseDto } from './dto';

@Controller('ng-cases')
export class NgCaseController {
  constructor(private readonly ngCaseService: NgCaseService) {}

  @Post()
  async create(@Body() body: CreateNgCaseDto, @Res() res: Response) {
    const result = await this.ngCaseService.create(body);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.ngCaseService.findAll();
    return res.status(result.statusCode).json(result);
  }

  @Get('ng-info')
  async findOne(@Query() query: FindNgCaseDto, @Res() res: Response) {
    const result = await this.ngCaseService.findOne(query);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(@Body() body: UpdateNgCaseDto, @Res() res: Response) {
    const result = await this.ngCaseService.update(body);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindNgCaseDto, @Res() res: Response) {
    const result = await this.ngCaseService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
