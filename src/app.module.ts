import { Module } from '@nestjs/common';
import { ThrottlerConfigModule } from '#configs/throttler/config.module';
import { AppConfigModule } from '#configs/app/config.module';
import { PostgresDatabaseProviderModule } from '#providers/database/postgres/provider.module';
import { StoragesController } from '#models/storages/storages.controller';
import { StoragesModule } from '#models/storages/storages.module';
import { MulterConfigModule } from '#configs/multer/config.module';

@Module({
  imports: [
    AppConfigModule,
    PostgresDatabaseProviderModule,
    ThrottlerConfigModule,
    MulterConfigModule,
    StoragesModule,
  ],
  controllers: [StoragesController],
})
export class AppModule {}
