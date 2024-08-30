import { IsString, IsNotEmpty } from 'class-validator';

export class FindOperatorDto {
  @IsString()
  @IsNotEmpty()
  operator_id: string;
}
