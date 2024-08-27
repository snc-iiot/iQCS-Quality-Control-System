// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as ldapjs from 'ldapjs';
import * as jwt from 'jsonwebtoken';
// import { AuthLoginDto } from './dto/auth-login.dto';
import { TJwtPayload } from 'src/types/jwt-payload';
import { TServiceResponse } from 'src/types/service-response';
import { LoginDto, LoginWithEmployeeIdDto } from './dto';
import { config } from 'src/common/configs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(input: LoginDto): Promise<TServiceResponse> {
    // return loginDto;
    try {
      // /*
      //! Check LDAP Credentials
      const ldapCheck = await this.checkLdapCredentials(
        input.username,
        input.password,
      );

      if (!ldapCheck)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid Credentials (LDAP)',
          data: [],
        };
      // */

      //! Check User in DB
      const user = await this.userRepository.findOne({
        where: { username: input.username?.toLowerCase() },
      });
      if (!user)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid Credentials (DB)',
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
        role: user.roles,
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
            role: user.roles,
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

  async loginWithEmployeeId(
    input: LoginWithEmployeeIdDto,
  ): Promise<TServiceResponse> {
    // return loginDto;
    try {
      //! Check User in DB
      const user = await this.userRepository.findOne({
        where: { employee_id: input.employee_id },
      });
      if (!user)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid Credentials (DB)',
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
        role: user.roles,
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
            role: user.roles,
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

  private checkLdapCredentials(username: string, password: string) {
    return new Promise((resolve /*, reject*/) => {
      const server = 'snc-former.com'; // for Private IP (Intranet)
      const client = ldapjs.createClient({ url: `ldap://${server}` });

      // Connect and bind to LDAP server
      const userBind = `${username}@${server}`;
      client.bind(userBind, password, (err) => {
        if (err) {
          //    console.error("Error binding to LDAP server:", err);
          // reject(err);
          resolve(false);
          return;
        }
        //  console.log("Successfully connected to LDAP server");
        client.unbind();
        resolve(true);
      });
    });
  }
}
