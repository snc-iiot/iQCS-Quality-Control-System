import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

type TProcess =
  | 'CUTTING'
  | 'BENDING'
  | 'PRESS'
  | 'SPOT'
  | 'PAINTING'
  | 'PRE-ASSEMBLY'
  | 'ASSEMBLY';

export class CreateNgCaseDto {
  @IsString()
  @IsNotEmpty()
  case_name: string;

  @IsArray()
  @ArrayMinSize(1)
  processes: TProcess[];

  description: string;
}
