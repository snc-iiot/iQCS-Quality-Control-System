import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindMachineDto {
  @IsUUID()
  @IsNotEmpty()
  machine_id: string;
}
