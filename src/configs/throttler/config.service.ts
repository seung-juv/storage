import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private configService: ConfigService) {}

  get ttl(): number {
    return Number(this.configService.get<number>('throttler.ttl'));
  }

  get limit(): number {
    return Number(this.configService.get<number>('throttler.limit'));
  }

  createThrottlerOptions():
    | Promise<ThrottlerModuleOptions>
    | ThrottlerModuleOptions {
    return {
      ttl: this.ttl,
      limit: this.limit,
    };
  }
}
