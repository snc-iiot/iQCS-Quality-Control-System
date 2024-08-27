// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
// import { AuthLoginDto } from './dto/auth-login.dto';
import { TJwtPayload } from 'src/types/jwt-payload';
import { TServiceResponse } from 'src/types/service-response';
import { LoginDto } from './dto';
import { config } from 'src/common/configs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(input: LoginDto): Promise<TServiceResponse> {
    // return loginDto;
    try {
      //! Check User in DB
      const user = await this.userRepository.findOne({
        where: { username: input.username?.toLowerCase() },
      });
      if (!user)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User not found',
          data: [],
        };

      const isMatched = await bcrypt.compare(input.password, user.password);
      if (!isMatched)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid password',
          data: [],
        };

      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'debug',
      //   data: [user],
      // };

      //? generate token
      const payload: TJwtPayload = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: '1000d',
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Login successfully',
        data: [
          {
            email: user.email,
            name: user.name,
            role: user.role,
            token,
          },
        ],
      };
    } catch (error) {
      // console.log(error);
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async genPassword(password: string): Promise<TServiceResponse> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      return {
        status: 'success',
        statusCode: 200,
        message: 'Password generated',
        data: [
          {
            password: hash,
          },
        ],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }
}
