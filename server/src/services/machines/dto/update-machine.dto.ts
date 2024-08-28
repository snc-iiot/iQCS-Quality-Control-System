import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateMachineDto {
  @IsUUID()
  @IsNotEmpty()
  machine_id: string;

  @IsString()
  @IsNotEmpty()
  machine_name: string;

  machine_no: string;
  description: string;
  location: string;
}
