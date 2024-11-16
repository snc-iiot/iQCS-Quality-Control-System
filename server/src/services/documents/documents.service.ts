import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities';
import { TServiceResponse, TJwtPayload } from 'src/types';
import { FtpUploadFileFromBase64 } from 'src/common/utils';
import { CreateDocumentDto, UpdateDocumentDto, FindDocumentDto } from './dto';

//! https://stackoverflow.com/questions/4212861/what-is-a-correct-mime-type-for-docx-pptx-etc
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  randomString(length: number = 8): string {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz_-';
    let randomstring = '';
    for (let i = 0; i < length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  async create(
    input: CreateDocumentDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      // check type file from base64
      const [mimeType, base64Data] = input.document_data.split(';base64,');
      const [type, extension] = mimeType.split('/');

      const mapFiles = {
        pdf: 'pdf',
        csv: 'csv',
        msword: 'doc',
        'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'vnd.ms-excel': 'xls',
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'vnd.ms-powerpoint': 'ppt',
        'vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      };
      if (type !== 'data:application' || !mapFiles[extension])
        return {
          status: 'error',
          statusCode: 400,
          message:
            'Invalid file type (only pdf, csv, doc, docx, xls, xlsx, ppt, pptx) allowed',
          data: [],
        };

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
        folder_id: input.folder_id,
      };

      const filename = `${this.randomString(20)}_${Date.now()}.${mapFiles[extension]}`;
      const remotePath = `/CoDE_Data/iqcs/docs/v1/${filename}`;
      const isUploaded = await FtpUploadFileFromBase64(base64Data, remotePath);

      if (isUploaded)
        record.source_file = `https://sncservices.sncformer.com/data/iqcs/docs/v1/${filename}`;

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
        folder_id: input.folder_id,
        document_description: input.document_description ?? '',
        effective_date: !Boolean(input.effective_date)
          ? null
          : input.effective_date,
        expire_date: !Boolean(input.expire_date) ? null : input.expire_date,
        source_file: null,
      };

      if (
        input.document_data !== null ||
        (input.document_data?.length ?? 0) > 100
      ) {
        // check type file from base64
        const [mimeType, base64Data] = input.document_data.split(';base64,');
        const [type, extension] = mimeType.split('/');

        const mapFiles = {
          pdf: 'pdf',
          csv: 'csv',
          msword: 'doc',
          'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
          'vnd.ms-excel': 'xls',
          'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
          'vnd.ms-powerpoint': 'ppt',
          'vnd.openxmlformats-officedocument.presentationml.presentation':
            'pptx',
        };

        console.log('type', type, extension);

        if (type !== 'data:application' || !mapFiles[extension])
          return {
            status: 'error',
            statusCode: 400,
            message:
              'Invalid file type (only pdf, csv, doc, docx, xls, xlsx, ppt, pptx) allowed',
            data: [],
          };

        const filename = `${this.randomString(20)}_${Date.now()}.${mapFiles[extension]}`;
        const remotePath = `/CoDE_Data/iqcs/docs/v1/${filename}`;
        const isUploaded = await FtpUploadFileFromBase64(
          base64Data,
          remotePath,
        );

        if (isUploaded)
          record.source_file = `https://sncservices.sncformer.com/data/iqcs/docs/v1/${filename}`;
      }

      if (record.source_file === null) delete record.source_file;
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
      // const results = await this.documentRepository.find({
      //   where: {
      //     plant_code: decoded.plant_code,
      //   },
      //   order: {
      //     created_at: 'DESC',
      //   },
      // });

      const results = await this.documentRepository
        .createQueryBuilder('t1')
        .where('t1.plant_code = :plant_code', {
          plant_code: decoded.plant_code,
        })
        .leftJoin('tb_users', 't2', 't1.creator_id = t2.user_id')
        .select('t1.*, t2.name as creator_name')
        .orderBy('t1.created_at', 'DESC')
        .getRawMany();

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
