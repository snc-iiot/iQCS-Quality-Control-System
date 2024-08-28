import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProcessDto {
  @IsString()
  @IsNotEmpty()
  process_name: string;

  process_description: string;
  process_color: string;
}
