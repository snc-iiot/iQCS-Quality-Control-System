import {
  IsString,
  IsNotEmpty,
  // Matches,
  IsDateString,
  IsIn,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';

export class UpdateProductivityDto {
  @IsUUID()
  @IsNotEmpty()
  prod_log_id: string;

  @IsDateString()
  @IsNotEmpty()
  // @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
  //   message: 'date must be in the format yyyy-mm-dd hh:mm:ss',
  // })
  datetime: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'CUTTING',
    'BENDING',
    'PRESS',
    'SPOT',
    'PAINTING',
    'PRE-ASSEMBLY',
    'ASSEMBLY',
  ])
  process: string;

  @IsString()
  @IsNotEmpty()
  part_code: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  machine_name: string;
  ng_quantity: number;
  remarks: string;
}
