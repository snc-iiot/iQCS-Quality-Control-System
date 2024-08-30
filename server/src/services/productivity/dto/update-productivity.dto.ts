import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateProductivityDto {
  @IsUUID()
  @IsNotEmpty()
  prod_log_id: string;

  @IsDateString()
  @IsNotEmpty()
  datetime: string;

  @IsUUID()
  @IsNotEmpty()
  process_id: string;

  @IsUUID()
  @IsNotEmpty()
  part_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  machine_id: string;
  operator_id: string;
  remarks: string;
}
