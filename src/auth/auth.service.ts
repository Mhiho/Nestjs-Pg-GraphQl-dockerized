import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { secret } from '../config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    validate(email: string, pwdHash: string): User | null {
        const user = this.usersService.getUserByEmail(email);

        if (!user) {
            return null;
        }

        const passwordIsValid = pwdHash === user.pwdHash;
        return passwordIsValid ? user : null;
    }

    login(user: User): { access_token: string } {
        const payload = {
            email: user.email,
            sub: user.uuid
        }

        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    verify(token: string): User {
        const decoded = this.jwtService.verify(token, {
            secret: secret
        })

        const user = this.usersService.getUserByEmail(decoded.email);

        if (!user) {
            throw new Error('Unable to get the user from decoded token.');
        }

        return user;
    }
}
