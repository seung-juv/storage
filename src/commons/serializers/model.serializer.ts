import { ApiProperty } from '@nestjs/swagger';
import { ObjectLiteral } from 'typeorm';

export class ModelEntity implements ObjectLiteral {
  @ApiProperty({ type: String })
  id: string;
}
