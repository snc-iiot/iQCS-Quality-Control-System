import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsNumber,
  Min,
  ValidateNested,
  // IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

// export class ProcessDto {
//   @IsUUID()
//   // @IsNotEmpty()
//   process_id: string;
// }

export class PartsDto {
  @IsString()
  @IsNotEmpty()
  part_code: string;

  @IsString()
  @IsNotEmpty()
  part_name: string;

  @IsArray()
  @ArrayMinSize(1)
  processes: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  sap_code: string;
  part_description: string;
  customers: string[];
}

export class CreatePartsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => PartsDto)
  // processes: ProcessDto[];
  data: PartsDto[];
}
