import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePartDto {
  @IsString()
  @IsNotEmpty()
  part_code: string;

  @IsString()
  @IsNotEmpty()
  part_name: string;

  part_description: string;
}
