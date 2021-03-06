import { Controller, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { LoginUserInput } from './dto/input/login-user.input';
import { AuthService } from 'src/auth/auth.service';

@Controller()
@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService,
    ) { }

    @Query(() => User, { name: 'user', nullable: true })
    @UseGuards(GqlAuthGuard)
    async getUser(@CurrentUser() user: User, @Args() getUserArgs: GetUserArgs): Promise<User> {
        return await this.usersService.getUser(getUserArgs.uuid);
    }

    @Query(() => [User], { name: 'users', nullable: 'items' })
    async getUsers(): Promise<User[]> {
        return await this.usersService.getUsers();
    }

    @Query(returns => User)
    @UseGuards(GqlAuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return this.usersService.getUser(user.uuid);
    }

    @Mutation(() => User)
    updateUser(@Args('updateUserData') updateUserData: UpdateUserInput) {
        return this.usersService.updateUser(updateUserData);
    }

    @Roles(Role.Admin)
    @Mutation(() => User)
    deleteUser(@Args('deleteUserData') deleteUserData: DeleteUserInput) {
        return this.usersService.deleteUser(deleteUserData.uuid);
    }
}