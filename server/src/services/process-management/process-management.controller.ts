import { Controller, Post, Body, Req } from '@nestjs/common';
import { ProcessManagementService } from './process-management.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { ExtendedRequest } from './interfaces/extended-request.interface';

@Controller('process-management')
export class ProcessManagementController {
  constructor(
    private readonly processManagementService: ProcessManagementService,
  ) {}

  @Post('create')
  async create(@Body() body: CreateProcessDto, @Req() req: ExtendedRequest) {
    const userId = req.user.userId;
    const result = await this.processManagementService.create(body, userId);
    return result;
  }
}
