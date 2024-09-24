import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UpdatePriceService } from './update-price.service';
import { TJwtPayload } from 'src/types';
import { SaveUpdatePriceDto, FindUpdatePriceDto } from './dto';

@Controller('update-prices')
export class UpdatePriceController {
  constructor(private readonly updatePriceService: UpdatePriceService) {}

  @Post()
  async save(
    @Body() body: SaveUpdatePriceDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.updatePriceService.save(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.updatePriceService.findAll(req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindUpdatePriceDto, @Res() res: Response) {
    const result = await this.updatePriceService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
