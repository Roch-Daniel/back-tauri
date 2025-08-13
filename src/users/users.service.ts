import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { notFound } from 'src/utils/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: number) {
    const [user] = await this.userRepository.find({ where: { id } });

    if (!user) notFound(`User with id ${id} not found.`);

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: createUserDto.password,
      };
      const user = this.userRepository.create(newUser);
      return await this.userRepository.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.driverError?.code === '23505'
      ) {
        throw new ConflictException(`Email already exists.`);
      }
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const partialUpdateDto = {
      name: updateUserDto?.name,
      passwordHash: updateUserDto?.password,
    };
    const user = await this.userRepository.preload({
      id,
      ...partialUpdateDto,
    });
    if (!user) {
      return notFound(`User with id ${id} not found.`);
    }
    const sucessUserUpdate = await this.userRepository.save(user);
    return { sucess: true, user: { ...sucessUserUpdate } };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return notFound(`User with id ${id} not found.`);
    }
    const userRemoved = await this.userRepository.remove(user);
    return { sucess_remove: true, user: { email: userRemoved.email } };
  }
}
