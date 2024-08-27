// src/auth/auth.controller.ts
import { Controller, Post, Query, Get, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const result = await this.usersService.login(body);
    return res.status(result.statusCode).json(result);
  }

  @Get('gen-pass')
  async genPassword(@Query('password') password: string, @Res() res: Response) {
    const result = await this.usersService.genPassword(password);
    return res.status(result.statusCode).json(result);
  }

  // @Post('login-with-employee-id')
  // async loginWithEmployeeId(
  //   @Body() body: LoginWithEmployeeIdDto,
  //   @Res() res: Response,
  // ) {
  //   const result = await this.usersService.loginWithEmployeeId(body);
  //   return res.status(result.statusCode).json(result);
  // }
}
