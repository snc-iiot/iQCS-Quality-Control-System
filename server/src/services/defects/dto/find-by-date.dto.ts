import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class FindByDateDto {
  @IsString()
  @IsNotEmpty()
  // @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
  //   message: 'date must be in the format yyyy-mm-dd hh:mm:ss',
  // })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-mm-dd',
  })
  date: string;

  // @IsString()
  // @IsNotEmpty()
  // @IsIn(['P', 'S', 'ALL'])
  defects_type: string;
}
