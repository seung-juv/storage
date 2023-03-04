import { Module } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { StoragesRepository } from './storages.repository';
import { TypeOrmExModule } from '#commons/modules/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([StoragesRepository])],
  providers: [StoragesService],
  exports: [StoragesService],
})
export class StoragesModule {}
