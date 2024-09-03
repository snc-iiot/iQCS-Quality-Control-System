import {
  IsString,
  IsNotEmpty,
  // Matches,
  IsDateString,
  IsIn,
  IsUUID,
  IsNumber,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DefectsDto {
  @IsUUID()
  @IsNotEmpty()
  case_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  ng_quantity: number;
}

export class CreateDefectsMoreNgCasesDto {
  @IsDateString()
  @IsNotEmpty()
  // @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
  //   message: 'date must be in the format yyyy-mm-dd hh:mm:ss',
  // })
  datetime: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['P', 'S'])
  defects_type: string;

  @IsUUID()
  @IsNotEmpty()
  process_id: string;

  @IsString()
  @IsNotEmpty()
  part_id: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DefectsDto)
  defects: DefectsDto[];

  machine_id: string;
  operator_id: string;
  production_quantity: number;
  rework_quantity: number;
  scrap_quantity: number;
  claim_supplier_quantity: number;
  scrap_approval_sheet_no: string;
  car_no: string;
  image: string;
  solve_problem: string;
  remarks: string;
}
