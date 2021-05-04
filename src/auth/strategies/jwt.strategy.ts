import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from '../../users/entities/user.entity';

import { UsersService } from '../../users/users.service';
import { secret } from '../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret
        })
    }

    validate(validationPayload: { email: string, sub: string }): User | null {
        return this.usersService.getUserByEmail(validationPayload.email);
    }
}