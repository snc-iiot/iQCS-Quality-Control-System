import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class FindProcessDto {
  @IsUUID()
  @IsNotEmpty()
  process_id: string;
}
