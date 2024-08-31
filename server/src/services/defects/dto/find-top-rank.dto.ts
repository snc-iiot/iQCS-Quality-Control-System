import {
  IsNotEmpty,
  IsString,
  Matches,
  IsIn,
  Min,
  IsNumber,
} from 'class-validator';

export class FindTopRankDto {
  @IsString()
  @IsNotEmpty()
  // @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
  //   message: 'date must be in the format yyyy-mm-dd hh:mm:ss',
  // })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-mm-dd',
  })
  date: string;

  @IsString()
  @IsNotEmpty()
  process_id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ALL', 'DAY', 'NIGHT'])
  shift: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  ranking: number;
}
