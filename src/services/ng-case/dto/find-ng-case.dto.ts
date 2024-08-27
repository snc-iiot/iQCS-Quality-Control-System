import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindNgCaseDto {
  @IsUUID()
  @IsNotEmpty()
  ng_id: string;
}
