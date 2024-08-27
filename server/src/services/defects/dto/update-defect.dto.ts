import {
  IsString,
  IsNotEmpty,
  IsDateString,
  // Matches,
  IsIn,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateDefectsDto {
  @IsUUID()
  @IsNotEmpty()
  defects_log_id: string;

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

  @IsUUID()
  @IsNotEmpty()
  ng_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  ng_quantity: number;

  machine_name: string;
  rework_quantity: number;
  rework_cost_per_unit: number;
  scrap_quantity: number;
  scrap_cost_per_unit: number;
  image: string;
  solve_problem: string;
  remarks: string;
}
