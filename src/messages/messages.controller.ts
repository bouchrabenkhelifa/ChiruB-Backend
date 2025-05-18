// messages.controller.ts
import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, MessageStatus } from './messages.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async createMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.createMessage(dto);
  }

  @Get('session/:sessionId')
  async getSessionMessages(@Param('sessionId') sessionId: string) {
    return this.messagesService.getSessionMessages(Number(sessionId));
  }

  @Patch(':id/status')
  async updateMessageStatus(
    @Param('id') id: string,
    @Body() body: { status: MessageStatus }
  ) {
    return this.messagesService.updateMessageStatus(Number(id), body.status);
  }
}