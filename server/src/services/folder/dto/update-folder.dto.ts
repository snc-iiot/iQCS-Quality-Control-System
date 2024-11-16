import { IsString, IsNotEmpty, /*Matches,*/ IsUUID } from 'class-validator';

export class UpdateFolderDto {
  @IsUUID()
  @IsNotEmpty()
  folder_id: string;

  @IsString()
  @IsNotEmpty()
  folder_name: string;
}
