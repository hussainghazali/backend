import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CurrentUser } from '../components/users/models/current.user';
import { UsersService } from '../components/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UsersService) {
    super({ usernameField: 'pNumber' });
  }

  async validate(pNumber: string, password: string): Promise<CurrentUser> {
    let user = await this.userService.validateUserCredentials(pNumber, password);

    if (user == null) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
