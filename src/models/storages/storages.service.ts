import { Injectable } from '@nestjs/common';
import { StoragesRepository } from './storages.repository';
import { StorageEntity } from '#models/storages/serializers/storages.serializer';

@Injectable()
export class StoragesService {
  constructor(private readonly storagesRepository: StoragesRepository) {}

  create(file: Express.Multer.File): Promise<StorageEntity> {
    return this.storagesRepository.createEntity({
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
  }

  get(id: string): Promise<StorageEntity> {
    return this.storagesRepository.get(id);
  }
}
