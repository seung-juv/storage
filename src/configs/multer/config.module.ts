import configuration from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { MulterConfigService } from './config.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        STORAGE_PATH: Joi.string(),
      }),
    }),
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      useClass: MulterConfigService,
    }),
  ],
  providers: [ConfigService, MulterConfigService],
  exports: [ConfigService, MulterConfigService, MulterModule],
})
export class MulterConfigModule {}
