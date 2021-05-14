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
import { ResGql } from '../decorators/otherDecorators';
import { LoginUserInput } from 'src/users/dto/input/login-user.input';
import { LoginDto } from './loginDto.interface';
import { sign } from 'jsonwebtoken';
import { secret } from '../config';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { v4 as uuid } from 'uuid';

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

    private createToken(currentTokenId: string): {accessToken: string, expiresIn: number} {
      const payload: JwtPayload = { id: currentTokenId };
      const expiresIn = 60 * 60 * 24;
      const accessToken = sign(payload, secret, { expiresIn });
      return {
          accessToken,
          expiresIn,
      };
  };

  private async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
        token = uuid();
        userWithThisToken = await this.userRepository.findOne({ currentTokenId: token });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await this.userRepository.save(user);

    return token;
};

    async validateUser(email: string, password: string): Promise<User | null> {
      const user = await this.userRepository.findOne({email, pwdHash: password});
      if (!user) {
        throw Error('Authenticate validation error');
      }
      return user;
      }


      async login(req: LoginDto): Promise<any> {
        try {

          const user = await this.userRepository.findOne({email: req.email});
            if (!user) {
                return 'Error'
            }
        const valid = await bcrypt.compare(req.password, user.pwdHash);
        if(!valid) {
          throw Error('password incorrect');
        }
            const token = await this.createToken(await this.generateToken(user));

            return user;
        } catch (e) {
            return 'Error'
        }
    };

    // async logout(user: User, res: Response) {
    //     try {
    //         user.currentTokenId = null;
    //         await user.save();
    //         res.clearCookie(
    //             'jwt',
    //             {
    //                 secure: false,
    //                 domain: 'localhost',
    //                 httpOnly: true,
    //             }
    //         );
    //         return res.json();
    //     } catch (e) {
    //         return res.json();
    //     }
    // }




      // async login(loginData : LoginDto, res : any) {
      //   const user = await this.userRepository.findOne({email: loginData.email});
      //   if(!user){
      //     throw Error('there is no such a user');
      //   }
      //   const valid = await bcrypt.compare(loginData.password, user.pwdHash);
      //   if(!valid) {
      //     throw Error('password incorrect');
      //   }
      //   const jwt = this.jwtService.sign({ id: user.id });
      //   const token = res.cookie('token', jwt, { httpOnly: true });
      //   user.tokens.push(token);
      //   await this.userRepository.save(user);
      // }

      async signUp(signUpData: SignUpInputDto, res: any): Promise<signUpResponse> {
        const user: User = new User();
        user.name = signUpData.name;
        user.email = signUpData.email;
        user.age = signUpData.age;
        user.description = signUpData.description;
        user.pwdHash = await hash(signUpData.password);
      
        const token = this.createToken(await this.generateToken(user));
        user.currentTokenId = token.accessToken;
        await this.userRepository.save(user)


        return this.filter(user);
      }
      
}
