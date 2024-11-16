import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  folder_name: string;
}
