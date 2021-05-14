import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { hash } from 'src/utils/hash-pwd';
import { updateUserResponse } from './update-user-response.interface';
import { LoginUserInput } from './dto/input/login-user.input';
import * as bcrypt from 'bcrypt';
import { signUpResponse } from './sign-up-response.interface';
import { UserI } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }
  filter(user: User): signUpResponse {
    const { id, uuid, email, name, age, description } = user;
    return { id, uuid, email, name, age, description };
  }


  async updateUser(updateUserData: UpdateUserInput): Promise<updateUserResponse> {
    const user = await this.userRepository.findOne(updateUserData.uuid);
    Object.assign(user, updateUserData);
    return this.filter(user);
  }

  // async loginUser(data: LoginUserInput): Promise<User> {
  //   const user = await this.userRepository.findOne(data.email)
  //   console.log(user.email)
  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
  //   }
  //   const pass = await hash(data.password)
  //   const isMatch = await bcrypt.compare(user.pwdHash, pass);
  //   if (!isMatch) {
  //     throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  //   }

  //   return user;
  // }


  async getUser(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }
  async getUserByEmail(email: string): Promise<any> {
    return await this.userRepository.findOne({ email });
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async deleteUser(uuid: string): Promise<string> {
    await this.userRepository.delete(uuid);
    return `user with uuid ${uuid} deleted`;
  }

}