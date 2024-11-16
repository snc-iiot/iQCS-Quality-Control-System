import { Folder } from './../../folder/entities/folder.entity';
import { IsString, IsNotEmpty /*,IsEmpty, Matches*/ } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  document_name: string;

  @IsString()
  @IsNotEmpty()
  document_data: string;

  folder_id: string;

  document_description: string;

  // @IsEmpty()
  // @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
  //   message: 'Effective date must be in the format YYYY-MM-DD',
  // })
  effective_date: string;

  // @IsEmpty()
  // @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
  //   message: 'Effective date must be in the format YYYY-MM-DD',
  // })
  expire_date: string;
}
