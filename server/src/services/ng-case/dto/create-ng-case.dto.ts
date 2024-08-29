import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsUUID,
} from 'class-validator';
// import { Type } from 'class-transformer';

// export class ProcessDto {
//   @IsUUID()
//   // @IsNotEmpty()
//   process_id: string;
// }

export class CreateNgCaseDto {
  @IsString()
  @IsNotEmpty()
  case_name: string;

  @IsArray()
  @ArrayMinSize(1)
  // @Type(() => ProcessDto)
  processes: string[];

  description: string;
}
