import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities';
import { Document } from '../documents/entities';
import { User } from '../users/entities';
import { CreateFolderDto, UpdateFolderDto, FindFolderDto } from './dto';
import { TServiceResponse, TJwtPayload } from 'src/types';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    input: CreateFolderDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const newFolder = this.folderRepository.create({
        ...input,
        creator_id: decoded.user_id,
        plant_code: decoded.plant_code,
      });

      const savedFolder = await this.folderRepository.save(newFolder);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Folder created successfully',
        data: [savedFolder],
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
      // ดึงข้อมูล folder ทั้งหมดตาม plant_code
      const folders = await this.folderRepository.find({
        where: { plant_code: decoded.plant_code },
      });

      // นับจำนวน document ในแต่ละ folder_id
      const folderIds = folders.map((folder) => folder.folder_id);
      const documentCounts = await this.documentRepository
        .createQueryBuilder('documents')
        .select('folder_id')
        .addSelect('COUNT(document_id)', 'count')
        .where('folder_id IN (:...folderIds)', { folderIds })
        .groupBy('folder_id')
        .getRawMany();

      // สร้าง map เพื่อเชื่อมโยง folder_id กับจำนวนเอกสาร
      const documentCountMap = documentCounts.reduce(
        (map, doc) => ({ ...map, [doc.folder_id]: parseInt(doc.count, 10) }),
        {},
      );

      // ดึงข้อมูล creator name จาก tb_users
      const creatorIds = [
        ...new Set(folders.map((folder) => folder.creator_id)),
      ];
      const creators = await this.userRepository
        .createQueryBuilder('users')
        .select(['user_id', 'name'])
        .where('user_id IN (:...creatorIds)', { creatorIds })
        .getRawMany();

      // สร้าง map เพื่อเชื่อมโยง creator_id กับ name
      const creatorMap = creators.reduce(
        (map, user) => ({ ...map, [user.user_id]: user.name }),
        {},
      );

      // อัปเดต number_of_files และเพิ่ม creator_name ในแต่ละ folder
      for (const folder of folders) {
        folder.number_of_files = documentCountMap[folder.folder_id] || 0;
        folder['creator_name'] = creatorMap[folder.creator_id] || 'Unknown';
        await this.folderRepository.save(folder);
      }

      return {
        status: 'success',
        statusCode: 200,
        message: 'Folders retrieved successfully',
        data: folders,
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

  async update(input: UpdateFolderDto): Promise<TServiceResponse> {
    try {
      const record = await this.folderRepository.findOne({
        where: { folder_id: input.folder_id },
      });

      if (!record) {
        return {
          status: 'error',
          statusCode: 404,
          message: 'Folder not found',
          data: [],
        };
      }

      await this.folderRepository.update(
        { folder_id: input.folder_id },
        { folder_name: input.folder_name },
      );

      return {
        status: 'success',
        statusCode: 200,
        message: 'Folder updated successfully',
        data: [],
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

  async delete(input: FindFolderDto): Promise<TServiceResponse> {
    try {
      const record = await this.folderRepository.findOne({
        where: { folder_id: input.folder_id },
      });

      if (!record) {
        return {
          status: 'error',
          statusCode: 404,
          message: 'Folder not found',
          data: [],
        };
      }

      await this.folderRepository.delete({ folder_id: input.folder_id });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Folder deleted successfully',
        data: [],
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
