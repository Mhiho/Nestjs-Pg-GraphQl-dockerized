import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserI } from "src/users/user.interface";
import { User } from "../../users/entities/user.entity";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super()
    }

    async validate(username: string, pwdHash: string): Promise<UserI | null> {
        const user = this.authService.validateUser(username, pwdHash);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
