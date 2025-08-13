import { IsEmail, IsString } from 'class-validator';
import { MessageEntity } from 'src/messages/entities/messages.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => MessageEntity, (message) => message.from)
  fromMessage: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.to)
  toMessage: MessageEntity[];
}
