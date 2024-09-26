import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsNumber,
  Min,
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

  @IsString()
  @IsNotEmpty()
  model_id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @ArrayMinSize(1)
  // @Type(() => ProcessDto)
  // processes: ProcessDto[];
  processes: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  sap_code: string;
  part_description: string;
  customers: string[];
}
