import { Injectable, NotFoundException } from '@nestjs/common';
import { StoragesRepository } from './storages.repository';
import { StorageResponseDto } from '#models/storages/dtos/storages.dto';

@Injectable()
export class StoragesService {
  constructor(private readonly storagesRepository: StoragesRepository) {}

  async create(file: Express.Multer.File): Promise<StorageResponseDto> {
    const storageEntity = await this.storagesRepository.createEntity({
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
    const storageResponseDto = new StorageResponseDto();
    storageResponseDto.id = storageEntity.id;
    storageResponseDto.uri = `${process.env.APP_URL}/api/storages/${storageEntity.id}`;
    storageResponseDto.path = storageEntity.path;
    storageResponseDto.filename = storageEntity.filename;
    storageResponseDto.mimetype = storageEntity.mimetype;
    storageResponseDto.size = storageEntity.size;
    storageResponseDto.createdAt = storageEntity.createdAt;
    return storageResponseDto;
  }

  async get(id: string): Promise<StorageResponseDto> {
    const storageEntity = await this.storagesRepository.get(id);
    if (!storageEntity) {
      throw new NotFoundException();
    }
    const storageResponseDto = new StorageResponseDto();
    storageResponseDto.id = storageEntity.id;
    storageResponseDto.uri = `${process.env.APP_URL}/api/storages/${storageEntity.id}`;
    storageResponseDto.path = storageEntity.path;
    storageResponseDto.filename = storageEntity.filename;
    storageResponseDto.mimetype = storageEntity.mimetype;
    storageResponseDto.size = storageEntity.size;
    storageResponseDto.createdAt = storageEntity.createdAt;
    return storageResponseDto;
  }
}
