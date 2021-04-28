import { InputType, ID, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType()
@Entity()
export class CreateUserInput {
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
