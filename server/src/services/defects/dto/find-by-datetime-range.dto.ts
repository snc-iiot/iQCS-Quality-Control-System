import { IsDateString, IsNotEmpty } from 'class-validator';

export class FindByDatetimeRangeDto {
  @IsDateString()
  @IsNotEmpty()
  start_datetime: string;

  @IsDateString()
  @IsNotEmpty()
  end_datetime: string;

  // @IsString()
  // @IsNotEmpty()
  // @IsIn(['P', 'S', 'ALL'])
  defects_type: string;
}
