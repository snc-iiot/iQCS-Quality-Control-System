import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ModelsDto {
  @IsString()
  @IsNotEmpty()
  model_name: string;

  @IsString()
  model_description: string;
}

export class CreateModelsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => ModelsDto)
  data: ModelsDto[];
}
