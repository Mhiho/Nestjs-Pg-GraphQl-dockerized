import { CreateUserInput } from './create-user.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType()
@Entity()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 20, nullable: false })
  name: string;

  @Field()
  @Column({ length: 320, nullable: true })
  description: string;
}
