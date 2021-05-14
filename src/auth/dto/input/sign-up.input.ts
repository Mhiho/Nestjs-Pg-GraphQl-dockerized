import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class SignUpInputDto {
    @Field()
    @IsNotEmpty()
    @IsEmail()
    @Column({ nullable: false, type: 'varchar' })
    email: string;

    @Field()
    @Column({ length: 20, nullable: false, type: 'varchar' })
    name: string;

    @Field()
    @Column()
    password: string;

    @Column({nullable: false, type: 'varchar'})
    pwdHash: string;
  
    @Column({type: 'varchar', array: true, nullable: true})
    tokens: string[];
  
    @Field()
    @Column({ length: 320, nullable: true, type: 'varchar' })
    description: string;

    @Field()
    @IsNotEmpty()
    age: number;
}