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
import { Response } from 'express';
import * as fs from 'fs';
import { Binary } from 'typeorm';
import { StorageResponseDto } from '#models/storages/dtos/storages.dto';

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
    type: StorageResponseDto,
  })
  create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StorageResponseDto> {
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
    const storageResponseDto = await this.storagesService.get(id);
    const stream = fs.createReadStream(storageResponseDto.path);

    res.setHeader('Content-Type', storageResponseDto.mimetype);
    if (width || height) {
      const metadata = {
        width: Number(width),
        height: Number(height),
      };
      if (!width || !height) {
        const originMetadata = await sharp(storageResponseDto.path).metadata();
        if (!width) metadata.width = originMetadata.width;
        if (!height) metadata.height = originMetadata.height;
      }
      const path = `${storageResponseDto.path}_${metadata.width}x${metadata.height}`;
      const existsSync = fs.existsSync(path);
      if (!existsSync) {
        await sharp(storageResponseDto.path)
          .resize(metadata.width, metadata.height)
          .toFile(path);
      }
      fs.createReadStream(path).pipe(res);
      return;
    }

    stream.pipe(res);
  }

  @Get(':id/info')
  @ApiOkResponse({
    description: 'The record has been successfully get.',
    type: StorageResponseDto,
  })
  getInfo(@Param('id') id: string): Promise<StorageResponseDto> {
    return this.storagesService.get(id);
  }
}
