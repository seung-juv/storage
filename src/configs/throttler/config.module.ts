import configuration from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ThrottlerConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        THROTTLER_TTL: Joi.number().default(60),
        THROTTLER_LIMIT: Joi.number().default(10),
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ThrottlerConfigModule],
      useClass: ThrottlerConfigService,
    }),
  ],
  providers: [ConfigService, ThrottlerConfigService],
  exports: [ConfigService, ThrottlerConfigService],
})
export class ThrottlerConfigModule {}
