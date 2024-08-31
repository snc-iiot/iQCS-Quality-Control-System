import { IsString, IsNotEmpty, Matches, IsUUID } from 'class-validator';

export class FindByProcessDateRangeDto {
  @IsUUID()
  @IsNotEmpty()
  process_id: string;

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
}
