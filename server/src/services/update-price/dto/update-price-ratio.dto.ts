import { IsNotEmpty, Matches, IsNumber, Min, IsUUID } from 'class-validator';

export class UpdatePriceRatioDto {
  @IsUUID()
  @IsNotEmpty()
  ratio_id: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-mm-dd',
  })
  @IsNotEmpty()
  effective_date: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  ng_ratio: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  scrap_ratio: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  rework_ratio: string;

  remarks: string;
}
