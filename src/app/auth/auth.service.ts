import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AllConfigType } from 'src/config/variables/config.type';
import { RedisService } from 'src/db/redis/redis.service';
import { ApiService } from 'src/exception/api.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly jwtConfig: {
    secret: string;
    expires: string;
    refreshSecret: string;
    refreshExpires: string;
  };

  constructor(
    private readonly apiService: ApiService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
    private readonly userService: UserService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    const secret = this.configService.get<string>('jwt.secret', {
      infer: true,
    });
    const expires = this.configService.get<string>('jwt.expires', {
      infer: true,
    });
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret', {
      infer: true,
    });
    const refreshExpires = this.configService.get<string>(
      'jwt.refreshExpires',
      {
        infer: true,
      },
    );

    if (!secret || !refreshSecret || !expires || !refreshExpires) {
      throw new InternalServerErrorException('JWT configuration is incomplete');
    }

    this.jwtConfig = {
      secret,
      expires,
      refreshSecret,
      refreshExpires,
    };
  }

  // Register a new user
  async register(dto: RegisterDto) {
    const user = await this.userService.createUser(dto);
    if (!user.id) throw new Error('iughiu');

    await this.redisService.set(`user:${user.id}`, user);

    return this.authResponse(user);
  }

  // Authenticate and log in user
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    return this.authResponse(user);
  }

  // Validate user credentials
  private async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const isMatch = await user.comparePassword(password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async authResponse(user: UserEntity) {
    const accessToken = await this.generateToken(user, false);
    const refreshToken = await this.generateToken(user, true);
    return this.apiService.success({ user, accessToken, refreshToken });
  }

  // Generate JWT token for a user
  private async generateToken(
    user: UserEntity,
    isRefresh = false,
  ): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload, {
      secret: isRefresh ? this.jwtConfig.refreshSecret : this.jwtConfig.secret,
      expiresIn: isRefresh
        ? this.jwtConfig.refreshExpires
        : this.jwtConfig.expires,
    });
  }
}
