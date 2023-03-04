import { PaginatedDto, PaginationDto } from '#commons/dtos/pagination.dto';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ModelEntity } from '#commons/serializers/model.serializer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export interface PaginationOptions extends PaginationDto {
  pageable?: boolean;
}

export interface GetAllOptions<T extends ModelEntity>
  extends FindManyOptions<T> {
  pagination?: PaginationOptions;
}

export class ModelRepository<
  T extends ObjectLiteral,
  K extends ModelEntity,
> extends Repository<K> {
  getAll<O extends GetAllOptions<K>>(
    options?: O,
  ): O['pagination']['pageable'] extends true
    ? Promise<PaginatedDto<K> | null>
    : Promise<K[] | null>;
  async getAll(
    options?: GetAllOptions<K>,
  ): Promise<K[] | PaginatedDto<K> | null> {
    const { pagination, ...optionsWithoutPagination } = options ?? {};

    const page = pagination.page;
    const limit = pagination.limit;
    const offset = pagination.offset;

    if (pagination?.pageable === true) {
      const totalResults = await this.count({
        where: options.where,
      });
      const skip = pagination.offset + (pagination.page - 1) * pagination.limit;
      const results = await this.find({
        take: limit,
        skip,
        ...optionsWithoutPagination,
      });

      const resultsPerPage = results.length;

      return {
        pageInfo: {
          totalResults,
          resultsPerPage,
          page,
          limit,
          offset,
          hasNext: offset + limit * page < totalResults,
          hasPrev: page > 0,
        },
        results: this.transformMany(results),
      };
    }

    return this.find(optionsWithoutPagination)
      .then((entities) => {
        return Promise.resolve(entities ? this.transformMany(entities) : null);
      })
      .catch((error) => Promise.reject(error));
  }

  async get(
    id: string,
    relations: string[] = [],
    throwsException = false,
  ): Promise<K | null> {
    return this.findOne({
      where: { id: id as any },
      relations,
    })
      .then((entity) => {
        if (!entity && throwsException) {
          return Promise.reject(new NotFoundException('Model not found.'));
        }

        return Promise.resolve(entity ? this.transform(entity) : null);
      })
      .catch((error) => Promise.reject(error));
  }

  async createEntity(
    inputs: DeepPartial<K>,
    relations: string[] = [],
  ): Promise<K> {
    return this.save(inputs)
      .then((entity) => this.get((entity as any).id, relations))
      .catch((error) => Promise.reject(error));
  }

  async updateEntity(
    entity: K,
    inputs: QueryDeepPartialEntity<K>,
    relations: string[] = [],
  ): Promise<K> {
    return this.update(entity.id, inputs)
      .then(() => this.get(entity.id, relations))
      .catch((error) => Promise.reject(error));
  }

  transform(model: K, transformOptions: ClassTransformOptions = {}): K {
    return plainToClass(ModelEntity, model, transformOptions) as K;
  }

  transformMany(
    models: K[],
    transformOptions: ClassTransformOptions = {},
  ): K[] {
    return models.map((model) => this.transform(model, transformOptions));
  }
}
