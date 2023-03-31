import { ApiProperty } from '@nestjs/swagger';

export class StorageResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  uri: string;

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
