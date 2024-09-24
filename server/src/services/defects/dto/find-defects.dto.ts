import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindDefectsDto {
  @IsUUID()
  @IsNotEmpty()
  defects_log_id: string;
}
