import { Controller, Post, Req } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/middleware/auth.middleware';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Req() req: AuthenticatedRequest) {
    console.log('--------->', req.user);

    return null;
  }
}
