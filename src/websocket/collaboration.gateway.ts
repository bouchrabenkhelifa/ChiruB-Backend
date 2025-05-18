// collaboration.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { CreateMessageDto } from 'src/messages/messages.dto';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/guards/jwt-ws-auth.guard';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class CollaborationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private messagesService: MessagesService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinSession')
  async handleJoinSession(
    @MessageBody() data: { sessionId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const sessionRoom = `session-${data.sessionId}`;
    client.join(sessionRoom);
    return { event: 'joinedSession', sessionId: data.sessionId };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveSession')
  async handleLeaveSession(
    @MessageBody() data: { sessionId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const sessionRoom = `session-${data.sessionId}`;
    client.leave(sessionRoom);
    return { event: 'leftSession', sessionId: data.sessionId };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.createMessage(dto);
    const sessionRoom = `session-${dto.session_id}`;
    this.server.to(sessionRoom).emit('messageReceived', message);
    return message;
  }

  // Broadcast when control changes
  notifyControlChange(sessionId: number, controlData: any) {
    const sessionRoom = `session-${sessionId}`;
    this.server.to(sessionRoom).emit('controlChanged', controlData);
  }
}