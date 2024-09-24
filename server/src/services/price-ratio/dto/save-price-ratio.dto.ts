import { IsNotEmpty, Matches, IsNumber, Min } from 'class-validator';

export class SavePriceRatioDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-mm-dd',
  })
  @IsNotEmpty()
  effective_date: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  ng_ratio: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  scrap_ratio: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  rework_ratio: number;

  remarks: string;
}
