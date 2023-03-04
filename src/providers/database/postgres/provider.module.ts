import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresConfigModule } from '#configs/database/postgres/config.module';
import { PostgresConfigService } from '#configs/database/postgres/config.service';
import { Storage } from '#models/storages/entities/storage.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useFactory: (postgresConfigService: PostgresConfigService) => ({
        type: 'postgres' as DatabaseType,
        host: postgresConfigService.host,
        port: postgresConfigService.port,
        username: postgresConfigService.username,
        password: postgresConfigService.password,
        database: postgresConfigService.database,
        entities: [Storage],
        synchronize: true,
        logging: true,
      }),
      inject: [PostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class PostgresDatabaseProviderModule {}
