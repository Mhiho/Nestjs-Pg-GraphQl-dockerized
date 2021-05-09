import { Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { hash } from 'src/utils/hash-pwd';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserI } from 'src/users/user.interface';
import { SignUpInputDto } from './dto/input/sign-up.input';
import { signUpResponse } from 'src/users/sign-up-response.interface';

@Injectable()
export class AuthService {
    constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    filter(user: User): signUpResponse {
      const { id, uuid, email, name, age, description } = user;
      return { id, uuid, email, name, age, description };
    }

    async validateUser(email: string, pass: string): Promise<UserI | null> {
        const user = await this.userRepository.findOne(email);
        const password = await hash(pass);
        const isMatch = await bcrypt.compare(password, user.pwdHash)
        if (isMatch) {
          const { pwdHash, ...result } = user;
          return result;
        }
        return null;
      }

      async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

      async signUp(signUpData: SignUpInputDto): Promise<signUpResponse> {
        const user: User = new User();
        user.name = signUpData.name;
        user.email = signUpData.email;
        user.age = signUpData.age;
        user.description = signUpData.description;
        user.pwdHash = await hash(signUpData.password);
        await this.userRepository.save(user)
        return this.filter(user);
      }
      
}
