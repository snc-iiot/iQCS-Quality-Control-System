import { IsNotEmpty, Matches, IsNumber, Min, IsUUID } from 'class-validator';

export class FindPriceRatioDto {
  @IsUUID()
  @IsNotEmpty()
  ratio_id: string;
}
