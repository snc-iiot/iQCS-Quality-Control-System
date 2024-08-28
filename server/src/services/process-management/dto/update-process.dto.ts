import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateProcessDto {
  @IsString()
  @IsNotEmpty()
  process_name: string;

  @IsString()
  @IsNotEmpty()
  process_description?: string;

  @IsString()
  @IsNotEmpty()
  process_color: string;
}
