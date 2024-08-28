import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  machine_name: string;

  machine_no: string;
  description: string;
  location: string;
}
