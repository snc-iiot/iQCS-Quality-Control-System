import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
// import { Type } from 'class-transformer';

// class ProcessDto {
//   @IsUUID()
//   @IsNotEmpty()
//   process_id: string;
// }

export class UpdatePartDto {
  @IsUUID()
  @IsNotEmpty()
  part_id: string;

  @IsString()
  @IsNotEmpty()
  part_code: string;

  @IsString()
  @IsNotEmpty()
  part_name: string;

  @IsArray()
  @ArrayMinSize(1)
  // @Type(() => IsUUID)
  processes: string[];

  sap_code: string;
  part_description: string;
}
