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
import { PartsService } from './parts.service';
import { Request, Response } from 'express';
import {
  CreatePartDto,
  CreatePartsDto,
  UpdatePartDto,
  FindPartDto,
} from './dto';
import { TJwtPayload } from 'src/types';

@Controller('parts')
export class PartsController {
  constructor(private readonly partService: PartsService) {}

  @Post()
  async create(
    @Body() body: CreatePartDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.partService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Post('import-excel')
  async createParts(
    @Body() body: CreatePartsDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.partService.createParts(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(
    @Body() body: UpdatePartDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.partService.update(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.partService.findAll();
    return res.status(result.statusCode).json(result);
  }

  @Get('info')
  async findOne(@Query() query: FindPartDto, @Res() res: Response) {
    const result = await this.partService.findOne(query);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindPartDto, @Res() res: Response) {
    const result = await this.partService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
