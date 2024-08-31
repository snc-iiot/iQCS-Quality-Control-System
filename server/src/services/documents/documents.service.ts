import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities';
import { TServiceResponse, TJwtPayload } from 'src/types';
import { FtpUploadFileFromBase64 } from 'src/common/utils';
import { CreateDocumentDto, UpdateDocumentDto, FindDocumentDto } from './dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(
    input: CreateDocumentDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      // check type file from base64
      // const base64String = input.document_data;
      // let fileType = '';
      // if (base64String.charAt(0) === '/') {
      //   fileType = 'image';
      // } else if (base64String.charAt(0) === 'U') {
      //   fileType = 'video';
      // } else {
      //   fileType = 'document';
      // }

      const record = {
        document_name: input.document_name,
        document_description: input.document_description ?? '',
        effective_date: !Boolean(input.effective_date)
          ? null
          : input.effective_date,
        expire_date: !Boolean(input.expire_date) ? null : input.expire_date,
        source_file:
          'https://sncservices.sncformer.com/data/ivrs/v1/docs/pdf/IdgeDLtU-i1724032381/rE7feYodnyABIIz81RbOMbCXV6YWwbfy40XN5o67xJotbvu_odz91n-3cpn66wGNc70gk10Hr-vEjfo12Ap29lW0XgRF6VBA8lUB-FI-STMTS2.pdf',
        creator_id: decoded.user_id,
        plant_code: decoded.plant_code,
      };
      const created = await this.documentRepository.save(record);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Document created successfully',
        data: [created],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async update(input: UpdateDocumentDto): Promise<TServiceResponse> {
    try {
      const record = {
        document_name: input.document_name,
        document_description: input.document_description ?? '',
        effective_date: !Boolean(input.effective_date)
          ? null
          : input.effective_date,
        expire_date: !Boolean(input.expire_date) ? null : input.expire_date,
        source_file:
          'https://sncservices.sncformer.com/data/ivrs/v1/docs/pdf/IdgeDLtU-i1724032381/rE7feYodnyABIIz81RbOMbCXV6YWwbfy40XN5o67xJotbvu_odz91n-3cpn66wGNc70gk10Hr-vEjfo12Ap29lW0XgRF6VBA8lUB-FI-STMTS2.pdf',
      };
      const updated = await this.documentRepository.update(
        { document_id: input.document_id },
        record,
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Document updated successfully',
        data: [updated],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async findAll(decoded: TJwtPayload): Promise<TServiceResponse> {
    try {
      const results = await this.documentRepository.find({
        where: {
          plant_code: decoded.plant_code,
        },
        order: {
          created_at: 'DESC',
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'All Documents',
        data: results,
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async findOne(input: FindDocumentDto): Promise<TServiceResponse> {
    try {
      const results = await this.documentRepository.find({
        where: {
          document_id: input.document_id,
        },
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get Document',
        data: results,
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async delete(input: FindDocumentDto): Promise<TServiceResponse> {
    try {
      const deleted = await this.documentRepository.delete({
        document_id: input.document_id,
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Document deleted successfully',
        data: [deleted],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }
}
