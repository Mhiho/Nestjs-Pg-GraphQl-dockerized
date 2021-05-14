import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ResGql = createParamDecorator(
    (data: unknown, context: ExecutionContext): Response =>
      GqlExecutionContext.create(context).getContext().res,
  );
  
  export const GqlUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): User => {
      const ctx = GqlExecutionContext.create(context).getContext();
      return ctx.req && ctx.req.user;
    },
  );