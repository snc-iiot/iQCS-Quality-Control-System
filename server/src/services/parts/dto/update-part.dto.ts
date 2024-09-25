import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ArrayMinSize,
  IsNumber,
  Min,
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

  @IsString()
  @IsNotEmpty()
  model_id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @ArrayMinSize(1)
  // @Type(() => IsUUID)
  processes: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  sap_code: string;
  part_description: string;
  customers: string[];
}
