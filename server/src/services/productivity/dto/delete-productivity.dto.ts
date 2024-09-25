import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteProductivityDto {
  @IsUUID()
  @IsNotEmpty()
  prod_log_id: string;
}
