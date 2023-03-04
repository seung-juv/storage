import {
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StoragesService } from './storages.service';
import { StorageEntity } from '#models/storages/serializers/storages.serializer';
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('Storage')
@Controller('/api/storages')
export class StoragesController {
  constructor(private readonly storagesService: StoragesService) {}

  @Post()
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: StorageEntity,
  })
  create(@UploadedFile() file: Express.Multer.File) {
    return this.storagesService.create(file);
  }

  @Get(':id')
  @ApiResponse({
    description: 'Download file',
    type: Blob,
  })
  async get(@Param('id') id: string, @Res() res: Response) {
    const storageEntity = await this.storagesService.get(id);
    const stream = fs.createReadStream(storageEntity.path);

    res.setHeader('Content-Type', storageEntity.mimetype);
    stream.pipe(res);
  }
}
