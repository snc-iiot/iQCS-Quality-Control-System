import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOperatorDto {
  @IsString()
  @IsNotEmpty()
  operator_name: string;

  employee_id: string;
  position: string;
  responsibility: string;
  remarks: string;
}
