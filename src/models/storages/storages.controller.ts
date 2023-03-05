import * as sharp from 'sharp';
import {
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StoragesService } from './storages.service';
import { StorageEntity } from '#models/storages/serializers/storages.serializer';
import { Response } from 'express';
import * as fs from 'fs';
import { Binary } from 'typeorm';

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
  @ApiOkResponse({
    description: 'Download file',
    type: Binary,
  })
  @ApiQuery({ name: 'w', type: 'string', required: false, description: '넓이' })
  @ApiQuery({ name: 'h', type: 'string', required: false, description: '높이' })
  async get(
    @Param('id') id: string,
    @Query('w') width: number,
    @Query('h') height: number,
    @Res() res: Response,
  ) {
    const storageEntity = await this.storagesService.get(id);
    const stream = fs.createReadStream(storageEntity.path);

    res.setHeader('Content-Type', storageEntity.mimetype);
    if (width || height) {
      const metadata = {
        width: Number(width),
        height: Number(height),
      };
      if (!width || !height) {
        const originMetadata = await sharp(storageEntity.path).metadata();
        if (!width) metadata.width = originMetadata.width;
        if (!height) metadata.height = originMetadata.height;
      }
      const path = `${storageEntity.path}_${metadata.width}x${metadata.height}`;
      const existsSync = fs.existsSync(path);
      if (!existsSync) {
        await sharp(storageEntity.path)
          .resize(metadata.width, metadata.height)
          .toFile(path);
      }
      fs.createReadStream(path).pipe(res);
      return;
    }

    stream.pipe(res);
  }

  @Get(':id/info')
  getInfo(@Param('id') id: string) {
    return this.storagesService.get(id);
  }
}
