import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindNgCaseDto {
  @IsUUID()
  @IsNotEmpty()
  case_id: string;
}
