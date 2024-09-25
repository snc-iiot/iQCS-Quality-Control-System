import {
  Controller,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { ModelService } from './model.service';
import { Request, Response } from 'express';
import {
  CreateModelDto,
  CreateModelsDto,
  UpdateModelDto,
  FindModelDto,
} from './dto';
import { TJwtPayload } from 'src/types';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  async create(
    @Body() body: CreateModelDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.modelService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Post('import-excel')
  async createModels(
    @Body() body: CreateModelsDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.modelService.createModels(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(
    @Body() body: UpdateModelDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.modelService.update(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.modelService.findAll();
    return res.status(result.statusCode).json(result);
  }

  @Get('info')
  async findOne(@Query() query: FindModelDto, @Res() res: Response) {
    const result = await this.modelService.findOne(query);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindModelDto, @Res() res: Response) {
    const result = await this.modelService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
