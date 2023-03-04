import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as dayjs from 'dayjs';
import * as fs from 'fs';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  get storagePath(): string {
    return this.configService.get<string>('multer.storage_path');
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const dest = `${this.storagePath}/${dayjs().format('YYYYMM')}/`;
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          callback(null, dest);
        },
        filename(
          req,
          file,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, randomName);
        },
      }),
    };
  }
}
