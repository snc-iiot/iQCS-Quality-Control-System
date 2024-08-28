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
import { MachinesService } from './machines.service';
import { TJwtPayload } from 'src/types';
import { CreateMachineDto, UpdateMachineDto, FindMachineDto } from './dto';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  async create(
    @Body() body: CreateMachineDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.machinesService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.machinesService.findAll(req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get('info')
  async findOne(@Query() query: FindMachineDto, @Res() res: Response) {
    const result = await this.machinesService.findOne(query);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(@Body() body: UpdateMachineDto, @Res() res: Response) {
    const result = await this.machinesService.update(body);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindMachineDto, @Res() res: Response) {
    const result = await this.machinesService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
