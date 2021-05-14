import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { LoginUserInput } from '../users/dto/input/login-user.input';
import { User } from 'src/users/entities/user.entity';
import { SignUpInputDto } from './dto/input/sign-up.input';
import { ResGql } from 'src/decorators/otherDecorators';
import { Response } from 'express';

@Controller()
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => User)
  login(
    @Args('loginInput') loginData: LoginUserInput,
    @ResGql() res: Response,
  ) {
    return this.authService.login(loginData)
  }

  @Mutation(() => User)
  signUp(@Args('signUpData') signUpData: SignUpInputDto,
    @ResGql() res: Response,) {
    return this.authService.signUp(signUpData,res);
  }
}