import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 20, nullable: false, type: 'varchar' })
  name: string;

  @Field()
  @Column({ length: 320, nullable: true, type: 'varchar' })
  description: string;
}
