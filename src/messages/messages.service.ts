import { Injectable } from '@nestjs/common';
import { MessageEntity } from './entities/messages.entity';
import { notFound } from 'src/utils/errors';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async findAll(): Promise<MessageEntity[]> {
    return await this.messageRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const [message] = await this.messageRepository.find({ where: { id } });

    if (message) return message;

    notFound(`Message with id ${id} not found.`);
  }

  async create(createMessageDto: CreateMessageDto) {
    try {
      const newMessage = {
        ...createMessageDto,
        read: false,
        sentAt: new Date(),
      };
      const message = this.messageRepository.create(newMessage);
      console.log('Creating message:', message);
      return await this.messageRepository.save(message);
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

  //Query example
  findAllQuery(pagination: any): string {
    //const {limit, offset} = pagination;
    return JSON.stringify({
      ...pagination,
    });
  }
}
