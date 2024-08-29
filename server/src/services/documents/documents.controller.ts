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
import { DocumentsService } from './documents.service';
import { TJwtPayload } from 'src/types';
import { CreateDocumentDto, UpdateDocumentDto, FindDocumentDto } from './dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(
    @Body() body: CreateDocumentDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.documentsService.create(body, req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async findAll(
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.documentsService.findAll(req.decoded);
    return res.status(result.statusCode).json(result);
  }

  @Get('info')
  async findOne(@Query() query: FindDocumentDto, @Res() res: Response) {
    const result = await this.documentsService.findOne(query);
    return res.status(result.statusCode).json(result);
  }

  @Put()
  async update(@Body() body: UpdateDocumentDto, @Res() res: Response) {
    const result = await this.documentsService.update(body);
    return res.status(result.statusCode).json(result);
  }

  @Delete()
  async delete(@Query() query: FindDocumentDto, @Res() res: Response) {
    const result = await this.documentsService.delete(query);
    return res.status(result.statusCode).json(result);
  }
}
