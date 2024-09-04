import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class FindByDateRangeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-mm-dd',
  })
  start_date: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-mm-dd',
  })
  end_date: string;

  // @IsString()
  // @IsNotEmpty()
  // @IsIn(['P', 'S', 'ALL'])
  defects_type: string;
}
