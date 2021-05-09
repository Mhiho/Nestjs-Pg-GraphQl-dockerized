import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([User])],
    providers: [UsersService, UsersResolver],
    controllers: [UsersResolver],
    exports: [UsersService],
})
export class UsersModule {}