import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateOperatorDto {
  @IsString()
  @IsNotEmpty()
  operator_id: string;

  @IsString()
  @IsNotEmpty()
  operator_name: string;

  employee_id: string;
  position: string;
  responsibility: string;
  remarks: string;
}
