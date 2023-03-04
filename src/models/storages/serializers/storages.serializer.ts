import { ApiProperty } from '@nestjs/swagger';
import { IStorage } from '../interfaces/storages.interface';
import { ModelEntity } from '#commons/serializers/model.serializer';

export class StorageEntity extends ModelEntity implements IStorage {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  path: string;
  @ApiProperty({ type: String })
  filename: string;

  @ApiProperty({ type: String })
  mimetype: string;

  @ApiProperty({ type: Number })
  size: number;

  @ApiProperty({ type: Date })
  createdAt: Date;
}
