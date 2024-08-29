import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindPartDto {
  @IsUUID()
  @IsNotEmpty()
  part_id: string;
}
