import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ADMIN', 'USER', 'GUEST'])
  role: string;

  @IsString()
  @IsNotEmpty()
  plant_code: string;

  email: string;
}
