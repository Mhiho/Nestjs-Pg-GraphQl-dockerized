import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { CreateUserInput } from './dto/input/create-user.input';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { createUserResponse } from './create-user-response.interface';
import { hashPwd } from 'src/utils/hash-pwd';
import { updateUserResponse } from './update-user-response.interface'; 
import { UserI } from './uuid-response.interface';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }
  filter(user: User): createUserResponse {
    const { id, uuid, email, name, age, isAdmin, description } = user;
    return { id, uuid, email, name, age, isAdmin, description };
  }
  async createUser(createUserData: CreateUserInput): Promise<createUserResponse> {
    const user: User = new User();
    user.name = createUserData.name;
    user.email = createUserData.email;
    user.age = createUserData.age;
    user.isAdmin = createUserData.isAdmin;
    user.description = createUserData.description;
    user.pwdHash = hashPwd(createUserData.password);

    await this.userRepository.save(user)

    return this.filter(user);
  }

  async updateUser(updateUserData: UpdateUserInput): Promise<updateUserResponse> {

    const user = await this.userRepository.findOne(updateUserData.uuid);
    Object.assign(user, updateUserData);
    return this.filter(user);
  }

  async getUser(uuid: string): Promise<User> {
    return await this.userRepository.findOne({uuid});
  }
  async getUserByEmail(email: string): Promise<any> {
    return await this.userRepository.findOne({email});
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async deleteUser(uuid: string): Promise<string> {
    await this.userRepository.delete(uuid);
    return `user with uuid ${uuid} deleted`;
  }
}