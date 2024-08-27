import { IsNotEmpty, IsDateString } from 'class-validator';

export class FindByDatetimeDto {
  @IsDateString()
  @IsNotEmpty()
  // @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
  //   message: 'date must be in the format yyyy-mm-dd hh:mm:ss',
  // })
  datetime: string;
}
