import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindDocumentDto {
  @IsUUID()
  @IsNotEmpty()
  document_id: string;
}
