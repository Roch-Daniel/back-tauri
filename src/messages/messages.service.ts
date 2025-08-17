import { Injectable } from '@nestjs/common';
import { MessageEntity } from './entities/messages.entity';
import { notFound } from 'src/utils/errors';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<MessageEntity[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.messageRepository.find({
      order: { id: 'DESC' },
      relations: ['from', 'to'], // Include relations to fetch user details
      take: limit, // is the number of records to fetch
      skip: offset, // is the starting point
      select: {
        from: { id: true, name: true },
        to: { id: true, name: true },
      },
    });
  }

  async findOne(id: number) {
    const [message] = await this.messageRepository.find({
      where: { id },
      relations: ['from', 'to'],
      select: {
        from: { id: true, name: true },
        to: { id: true, name: true },
      },
    });

    if (message) return message;

    notFound(`Message with id ${id} not found.`);
  }

  async create(createMessageDto: CreateMessageDto) {
    const { fromId, toId } = createMessageDto;

    const from = await this.usersService.findOne(fromId);
    const to = await this.usersService.findOne(toId);

    try {
      const newMessage = {
        text: createMessageDto.text,
        from,
        to,
        read: false,
        sentAt: new Date(),
      };
      const message = this.messageRepository.create(newMessage);
      console.log('Creating message:', message);
      await this.messageRepository.save(message);
      return {
        message: {
          ...message,
          from: { id: message.from.id },
          to: { id: message.to.id },
        },
      };
    } catch (error) {
      throw new Error(`Error creating message: ${error}`);
    }
  }

  //update(id: string, body: Partial<Omit<MessageEntity, 'id' | 'sentAt'>>) {
  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const partialUpdateDto = {
      text: updateMessageDto?.text,
      read: updateMessageDto?.read,
    };
    const message = await this.messageRepository.preload({
      id,
      ...partialUpdateDto,
    });

    if (!message) {
      return notFound(`Message with id ${id} not found.`);
    }
    const sucessMessageUpdate = await this.messageRepository.save(message);
    return { sucess: true, message: { ...sucessMessageUpdate } };
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) {
      return notFound(`Message with id ${id} not found.`);
    }

    const messageRemoved = await this.messageRepository.remove(message);
    return { sucess_del: true, message: { ...messageRemoved } };
  }

  //Query example: query/?limit=10&offset=30
  /* findAllQuery(pagination: any): string {
    //const {limit, offset} = pagination;
    return JSON.stringify({
      ...pagination,
    });
  } */
}
