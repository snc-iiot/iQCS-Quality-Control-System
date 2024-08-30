import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';

export class FindProductivityDto {
  @IsUUID()
  @IsNotEmpty()
  prod_log_id: string;
}
