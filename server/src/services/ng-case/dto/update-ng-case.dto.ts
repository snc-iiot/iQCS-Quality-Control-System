import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsUUID,
} from 'class-validator';

export class UpdateNgCaseDto {
  @IsUUID()
  @IsNotEmpty()
  case_id: string;

  @IsString()
  @IsNotEmpty()
  case_name: string;

  @IsArray()
  @ArrayMinSize(1)
  processes: string[];

  description: string;
}
