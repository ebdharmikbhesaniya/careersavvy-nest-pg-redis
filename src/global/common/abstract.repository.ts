/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Injectable()
export abstract class abstractRepository<TDocument extends AbstractEntity> {
  constructor(protected repository: Repository<TDocument>) {}

  async findAll(options?: FindManyOptions<TDocument>): Promise<TDocument[]> {
    return await this.repository.find(options);
  }

  async findAllWithCount(options?: FindManyOptions<TDocument>): Promise<any> {
    return await this.repository.findAndCount(options);
  }

  async find(dto: any): Promise<TDocument[]> {
    return await this.repository.find(dto);
  }

  async findBy(
    where: FindOptionsWhere<TDocument> | FindOptionsWhere<TDocument>[],
  ): Promise<TDocument[]> {
    return await this.repository.findBy(where);
  }

  async findOne(options: FindOneOptions<TDocument>) {
    return await this.repository.findOne(options);
  }

  async findOneBy(
    where: FindOptionsWhere<TDocument>,
  ): Promise<TDocument | null> {
    return await this.repository.findOneBy(where);
  }

  async save(dto: TDocument) {
    return await this.repository.save(dto);
  }

  create(dto: TDocument) {
    return this.repository.create(dto);
  }

  async update(id: number, dto: TDocument) {
    return await this.repository.update(id, dto);
  }

  async softDelete(dto: any) {
    return await this.repository.softDelete(dto);
  }

  async delete(dto: any) {
    return await this.repository.delete(dto);
  }
}
