import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { abstractRepository } from 'src/global/common/abstract.repository';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
@Injectable()
export class UserRepository extends abstractRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>, // TypeORM repository
  ) {
    super(repo);
  }
}
