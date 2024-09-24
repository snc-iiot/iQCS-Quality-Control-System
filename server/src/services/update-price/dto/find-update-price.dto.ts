import { IsNotEmpty, Matches, IsNumber, Min, IsUUID } from 'class-validator';

export class FindUpdatePriceDto {
  @IsUUID()
  @IsNotEmpty()
  update_price_id: string;
}
