import {
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class DeleteDefectsDto {
  @IsUUID()
  @IsNotEmpty()
  defects_log_id: string;
}
