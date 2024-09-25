import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindModelDto {
  @IsUUID()
  @IsNotEmpty()
  model_id: string;
}
