import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateProductivityDto {
  @IsDateString()
  @IsNotEmpty()
  datetime: string;

  @IsString()
  @IsNotEmpty()
  process: string;

  @IsString()
  @IsNotEmpty()
  part_code: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  machine_name: string;

  remarks: string;
}
