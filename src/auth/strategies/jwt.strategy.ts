import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { secret } from '../../config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return (req && req.cookies) ? (req.cookies?.jwt ?? null) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
      super({
          jwtFromRequest: cookieExtractor,
          secretOrKey: secret,
      });
  }

  async validate(payload: JwtPayload, done: (error, user) => void) {
      if (!payload || !payload.id) {
          return done(new UnauthorizedException(), false);
      }

      const user = await this.userRepository.findOne({ currentTokenId: payload.id });
      if (!user) {
          return done(new UnauthorizedException(), false);
      }

      done(null, user);
  }
}
