import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { AllConfigType } from 'src/config/variables/config.type';

// 1. Define JWT payload interface
export interface JwtPayload {
  sub: number; // user ID
  email: string;
  iat?: number;
  exp?: number;
}

// 2. Extend Express Request to add user
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    const secret = this.configService.get<string>('jwt.secret', {
      infer: true,
    });

    if (!secret) {
      throw new Error('JWT secret is not defined in configuration');
    }

    this.jwtSecret = secret;
  }

  use(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header is missing or malformed',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      // 3. Strongly type the payload here
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.jwtSecret,
      });

      req.user = payload;
      next();
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
