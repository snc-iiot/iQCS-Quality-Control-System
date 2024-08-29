import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  // IsUUID,
} from 'class-validator';
// import { Type } from 'class-transformer';

// export class ProcessDto {
//   @IsUUID()
//   // @IsNotEmpty()
//   process_id: string;
// }

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  part_code: string;

  @IsString()
  @IsNotEmpty()
  part_name: string;

  @IsArray()
  @ArrayMinSize(1)
  // @Type(() => ProcessDto)
  // processes: ProcessDto[];
  processes: string[];

  sap_code: string;
  part_description: string;
}
