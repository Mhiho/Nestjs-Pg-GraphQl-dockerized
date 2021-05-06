import { Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { secret } from '../config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    private async generateToken(user: User): Promise<string> {
        let token : string;
        user.tokens.push(token);
        return token;
    };

    async validateUser(email: string, pwdHash: string): Promise<User | null> {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            return null;
        }
        const passwordIsValid = pwdHash === user.pwdHash;
        const result = passwordIsValid ? user : null;
        return await result
    }

    login( user: User) : {access_token: string} {
        const payload = {
            email: user.email,
            sub: user.uuid
        }

        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    // async logout(user: User, res: Response) {
    //     try {
    //         user.tokens = user.tokens.filter(token => {
    //             return token !== user.token
    //         })
    //         await user.save();
    //         return res.json({ok: true});
    //     } catch (e) {
    //         return res.json({error: e.message});
    //     }
    // }


    async verify(token: string): Promise<User> {
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
