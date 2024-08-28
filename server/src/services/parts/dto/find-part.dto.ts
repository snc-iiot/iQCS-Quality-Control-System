import { IsString, IsNotEmpty } from 'class-validator';

export class FindPartDto {
  @IsString()
  @IsNotEmpty()
  part_code: string;
}
