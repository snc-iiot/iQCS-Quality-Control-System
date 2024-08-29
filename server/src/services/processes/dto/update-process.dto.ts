import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateProcessDto {
  @IsUUID()
  @IsNotEmpty()
  process_id: string;

  @IsString()
  @IsNotEmpty()
  process_name: string;

  process_description: string;
  process_color: string;
}
