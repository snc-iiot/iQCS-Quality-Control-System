import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateModelDto {
  @IsString()
  @IsNotEmpty()
  model_name: string;

  @IsString()
  @IsOptional()
  model_description: string;
}
