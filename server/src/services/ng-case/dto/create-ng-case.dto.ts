import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CreateNgCaseDto {
  @IsString()
  @IsNotEmpty()
  case_name: string;

  @IsArray()
  @ArrayMinSize(1)
  processes: string[];

  description: string;
}
