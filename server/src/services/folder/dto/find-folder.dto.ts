import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindFolderDto {
  @IsUUID()
  @IsNotEmpty()
  folder_id: string;
}
