// src/auth/auth.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginWithEmployeeIdDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(body);
    return res.status(result.statusCode).json(result);
  }

  @Post('login-with-employee-id')
  async loginWithEmployeeId(
    @Body() body: LoginWithEmployeeIdDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.loginWithEmployeeId(body);
    return res.status(result.statusCode).json(result);
  }
}
