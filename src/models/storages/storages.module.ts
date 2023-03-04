import { Module } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoragesRepository } from './storages.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StoragesRepository])],
  providers: [StoragesService],
  exports: [StoragesService],
})
export class StoragesModule {}
