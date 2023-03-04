import {
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { StoragesService } from './storages.service';
import { StorageEntity } from '#models/storages/serializers/storages.serializer';

@ApiTags('storages')
@Controller('storages')
export class StoragesController {
  constructor(private readonly storagesService: StoragesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer(),
    }),
  )
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: StorageEntity,
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StorageEntity> {
    return this.storagesService.create(file);
  }
}
