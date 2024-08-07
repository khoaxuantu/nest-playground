import { AbstractModelFactory } from '@/lib/factory/interfaces/factory.interface';
import { AbstractModelRepository } from '@/lib/repository/interfaces/repository.interface';
import { GetListDtoAdapterResProps } from '../adapters/dto.adapters';
import { HydratedDocument, Types } from 'mongoose';

export abstract class AbstractResourceService<T extends HydratedDocument<any>> {
  constructor(
    protected repository: AbstractModelRepository<T>,
    protected factory: AbstractModelFactory<T>,
  ) {}

  findById(id: string) {
    return this.repository.findById(id);
  }

  listByFilter(query: GetListDtoAdapterResProps) {
    return this.repository.list({
      match: query.filterParams,
      limit: query.paginateParams.limit,
      skip: query.paginateParams.skip,
      sort: query.paginateParams.sort,
    });
  }

  listByManyIds(ids: string[]) {
    return this.repository.list({ match: ids });
  }

  createOne(payload: any) {
    return this.factory.create(payload);
  }

  updateOne(id: Types.ObjectId, payload: any) {
    return this.repository.findOneAndUpdate({ _id: id }, { $set: payload });
  }

  deleteOne(id: Types.ObjectId) {
    return this.repository.deleteOne({ _id: id });
  }
}
