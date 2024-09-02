import {
  IsNotEmpty,
  IsString,
  Matches,
  IsIn,
  // IsNumber,
  IsNumberString,
  Min,
} from 'class-validator';

export class FindTopRankDateRangeDto {
  @IsString()
  @IsNotEmpty()
  // @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
  //   message: 'date must be in the format yyyy-mm-dd hh:mm:ss',
  // })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-mm-dd',
  })
  start_date: string;

  @IsString()
  @IsNotEmpty()
  // @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
  //   message: 'date must be in the format yyyy-mm-dd hh:mm:ss',
  // })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-mm-dd',
  })
  end_date: string;

  @IsString()
  @IsNotEmpty()
  process_id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ALL', 'DAY', 'NIGHT'])
  shift: string;

  @IsNumberString()
  @IsNotEmpty()
  // @Min(1)
  ranking: number;
}
