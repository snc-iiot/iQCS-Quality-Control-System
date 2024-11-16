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
import { FolderService } from './folder.service';
import { TJwtPayload } from 'src/types';
import { CreateFolderDto, UpdateFolderDto, FindFolderDto } from './dto';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  async create(
    @Body() body: CreateFolderDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.folderService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.folderService.findAll(req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(@Body() body: UpdateFolderDto, @Res() res: Response) {
    const result = await this.folderService.update(body);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindFolderDto, @Res() res: Response) {
    const result = await this.folderService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
