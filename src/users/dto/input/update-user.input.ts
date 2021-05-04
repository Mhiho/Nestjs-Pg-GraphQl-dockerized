import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Column } from "typeorm";

@InputType()
export class UpdateUserInput {
    @Field()
    @IsNotEmpty()
    uuid: string;

    @Field()
    @IsOptional()
    @IsNotEmpty()
    @Column()
    age?: number;

    @Field()
    @Column({ length: 20, nullable: false, type: 'varchar' })
    name: string;

    @Field()
    @Column()
    password: string;

    @Column({nullable: false, type: 'varchar'})
    pwdHash: string;
  
    @Field()
    @Column({ length: 320, nullable: true, type: 'varchar' })
    description: string;
  
    @Field({ nullable: true })
    @Column()
    isAdmin?: boolean;
}