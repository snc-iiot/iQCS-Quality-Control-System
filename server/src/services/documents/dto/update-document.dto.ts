import { IsString, IsNotEmpty, /*Matches,*/ IsUUID } from 'class-validator';

export class UpdateDocumentDto {
  @IsUUID()
  @IsNotEmpty()
  document_id: string;

  @IsString()
  @IsNotEmpty()
  document_name: string;

  @IsString()
  @IsNotEmpty()
  document_data: string;

  document_description: string;

  // @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
  //   message: 'Effective date must be in the format YYYY-MM-DD',
  // })
  effective_date: string;

  // @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
  //   message: 'Effective date must be in the format YYYY-MM-DD',
  // })
  expire_date: string;
}
