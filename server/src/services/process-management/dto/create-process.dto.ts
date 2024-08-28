import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProcessDto {
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
