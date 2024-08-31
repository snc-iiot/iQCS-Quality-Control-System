import { IsNotEmpty, Matches, IsNumber, Min, IsUUID } from 'class-validator';

export class FindUpdatePriceDto {
  @IsUUID()
  @IsNotEmpty()
  update_price_id: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-mm-dd',
  })
  @IsNotEmpty()
  effective_date: string;

  @IsUUID()
  @IsNotEmpty()
  part_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  remarks: string;
}
