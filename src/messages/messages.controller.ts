import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageEntity } from './entities/messages.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @HttpCode(200)
  @Get()
  async findAll(): Promise<MessageEntity[]> {
    return await this.messagesService.findAll();
  }

  @HttpCode(200)
  @Get('query')
  findAllQuery(@Query() pagination: any): string {
    return this.messagesService.findAllQuery(pagination);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.findOne(id);
  }

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return JSON.stringify({
      sucess_create: true,
      ...(await this.messagesService.create(createMessageDto)),
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.remove(id);
  }
}
