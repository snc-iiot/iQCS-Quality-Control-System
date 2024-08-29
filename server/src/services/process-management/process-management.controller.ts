import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ProcessManagementService } from './process-management.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('process-management')
export class ProcessManagementController {
  constructor(
    private readonly processManagementService: ProcessManagementService,
  ) {}

  @UseGuards(JwtAuthGuard) // Assuming you have JWT authentication
  @Post('create')
  async create(@Body() body: CreateProcessDto, @Req() req: Request) {
    const userId = req.user['userId']; // Adjust this according to your JWT payload
    const result = await this.processManagementService.create(body, userId);
    return result;
  }
}
