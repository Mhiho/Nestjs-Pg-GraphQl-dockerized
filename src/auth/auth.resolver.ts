import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { LoginUserInput } from '../users/dto/input/login-user.input';
import { User } from 'src/users/entities/user.entity';
import { SignUpInputDto } from './dto/input/sign-up.input';

@Controller()
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(()=> User)
  async login(@Args('input') input: LoginUserInput) {
    return this.authService.login(input);
  }

  @Mutation(() => User)
  signUp(@Args('signUpData') signUpData: SignUpInputDto) {
      return this.authService.signUp(signUpData);
  }
}