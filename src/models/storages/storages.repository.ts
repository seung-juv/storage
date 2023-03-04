import { Storage } from './entities/storage.entity';
import { ModelRepository } from '../model.repository';
import { StorageEntity } from './serializers/storages.serializer';
import { CustomRepository } from '#commons/decorators/typeorm-ex.decorator';

@CustomRepository(Storage)
export class StoragesRepository extends ModelRepository<
  Storage,
  StorageEntity
> {}
