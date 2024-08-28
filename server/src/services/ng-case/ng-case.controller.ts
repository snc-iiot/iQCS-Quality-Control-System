import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NgCaseService } from './ng-case.service';
import { CreateNgCaseDto, UpdateNgCaseDto, FindNgCaseDto } from './dto';
import { TJwtPayload } from 'src/types';

@Controller('ng-cases')
export class NgCaseController {
  constructor(private readonly ngCaseService: NgCaseService) {}

  @Post()
  async create(
    @Body() body: CreateNgCaseDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.ngCaseService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.ngCaseService.findAll(req.decoded);
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
