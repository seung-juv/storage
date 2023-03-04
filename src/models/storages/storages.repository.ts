import { EntityRepository } from 'typeorm';
import { Storage } from './entities/storage.entity';
import { ModelRepository } from '../model.repository';
import { StorageEntity } from './serializers/storages.serializer';

@EntityRepository(Storage)
export class StoragesRepository extends ModelRepository<
  Storage,
  StorageEntity
> {}
