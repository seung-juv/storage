import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoragesRepository } from './storages.repository';
import { StorageEntity } from '#models/storages/serializers/storages.serializer';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(StoragesRepository)
    private readonly storagesRepository: StoragesRepository,
  ) {}

  async create(file: Express.Multer.File): Promise<StorageEntity> {
    return this.storagesRepository.createEntity({
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
  }
}
