import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepo.findOneBy({ email: dto.email });

    if (existingUser) {
      throw new BadRequestException('Email is already registered.');
    }

    const payload: UserEntity = {
      email: dto.email,
      password: dto.password,
    };

    return await this.userRepo.save(payload);
  }
}
