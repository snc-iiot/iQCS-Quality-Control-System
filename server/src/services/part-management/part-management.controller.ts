import {
  Controller,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Get,
  Res,
} from '@nestjs/common';
import { PartManagementService } from './part-management.service';
import { Response } from 'express';
import { CreatePartDto, UpdatePartDto, FindPartDto } from './dto';

@Controller('part-management')
export class PartManagementController {
  constructor(private readonly partManagementService: PartManagementService) {}

  @Post()
  async create(@Body() body: CreatePartDto, @Res() res: Response) {
    const result = await this.partManagementService.create(body);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(@Body() body: UpdatePartDto, @Res() res: Response) {
    const result = await this.partManagementService.update(body);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.partManagementService.findAll();
    return res.status(result.statusCode).json(result);
  }

  @Get('part-info')
  async findOne(@Query() query: FindPartDto, @Res() res: Response) {
    const result = await this.partManagementService.findOne(query);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindPartDto, @Res() res: Response) {
    const result = await this.partManagementService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
