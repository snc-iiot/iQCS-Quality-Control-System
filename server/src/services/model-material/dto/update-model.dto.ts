import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ArrayMinSize,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateModelDto {
  @IsUUID()
  @IsNotEmpty()
  model_id: string;

  @IsString()
  @IsNotEmpty()
  model_name: string;

  @IsString()
  model_description: string;
}
