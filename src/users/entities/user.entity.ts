import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uuid: string;

  @Field()
  @Column({ length: 20, nullable: false, type: 'varchar' })
  name: string;

  @Field()
  @Column({type: 'varchar', nullable: false})
  email: string;

  @Column({nullable: false, type: 'varchar'})
  pwdHash: string;

  @Column({type: 'varchar', array: true, nullable: true})
  tokens: string[];

  @Field()
  @Column({ length: 320, nullable: true, type: 'varchar' })
  description: string;

  @Field(() => Int)
  age: number;

  @Field({ nullable: true })
  isAdmin?: boolean;
}
