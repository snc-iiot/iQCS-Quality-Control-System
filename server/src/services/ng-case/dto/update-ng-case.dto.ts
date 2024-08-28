import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsUUID,
} from 'class-validator';

type TProcess =
  | 'CUTTING'
  | 'BENDING'
  | 'PRESS'
  | 'SPOT'
  | 'PAINTING'
  | 'PRE-ASSEMBLY'
  | 'ASSEMBLY';

export class UpdateNgCaseDto {
  @IsUUID()
  @IsNotEmpty()
  case_id: string;

  @IsString()
  @IsNotEmpty()
  case_name: string;

  @IsArray()
  @ArrayMinSize(1)
  processes: TProcess[];

  description: string;
}
