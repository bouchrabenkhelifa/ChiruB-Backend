import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BlackboardService } from '../blackboard/blackboard.service';
import { UseGuards } from '@nestjs/common';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { CreatePropositionDto } from '../blackboard/dto/create-proposition.dto';
import { UpdatePanelDto } from '../blackboard/dto/update-panel.dto';
import { SwitchActiveDoctorDto } from '../blackboard/dto/switch-active-doctor.dto';

// Extend Socket to include user property
interface AuthenticatedSocket extends Socket {
  user?: any;
}

@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict to your frontend domain
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly blackboardService: BlackboardService) {}

  // Handle client connections
  handleConnection(client: AuthenticatedSocket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Handle client disconnections
  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Join a session room
  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('joinSession')
  handleJoinSession(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { sessionId: number },
  ) {
    const roomName = `session_${data.sessionId}`;
    client.join(roomName);
    console.log(`Client ${client.id} joined room ${roomName}`);

    return { success: true, message: `Joined session ${data.sessionId}` };
  }

  // Leave a session room
  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('leaveSession')
  handleLeaveSession(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { sessionId: number },
  ) {
    const roomName = `session_${data.sessionId}`;
    client.leave(roomName);
    console.log(`Client ${client.id} left room ${roomName}`);

    return { success: true, message: `Left session ${data.sessionId}` };
  }

  // Add a proposition (Knowledge Source input)
  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('addProposition')
  async handleAddProposition(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: CreatePropositionDto,
  ) {
    try {
      const proposition = await this.blackboardService.addProposition(data);
      
      // Broadcast to everyone in the session
      const roomName = `session_${data.sessionId}`;
      this.server.to(roomName).emit('newProposition', proposition);
      
      return {
        success: true,
        data: proposition,
      };
    } catch (error) {
      console.error('Error adding proposition:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update a panel
  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('updatePanel')
  async handleUpdatePanel(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: UpdatePanelDto,
  ) {
    try {
      const panel = await this.blackboardService.updatePanel(data);
      
      // Broadcast to everyone in the session
      const roomName = `session_${data.sessionId}`;
      this.server.to(roomName).emit('panelUpdated', {
        type: data.panelType,
        level: data.level,
        panel,
      });
      
      return {
        success: true,
        data: panel,
      };
    } catch (error) {
      console.error('Error updating panel:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Switch active doctor (Scheduler decision)
  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('switchActiveDoctor')
  async handleSwitchActiveDoctor(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { medicChiefId: number; dto: SwitchActiveDoctorDto },
  ) {
    try {
      const session = await this.blackboardService.switchActiveDoctor(
        data.medicChiefId,
        data.dto,
      );
      
      // Broadcast to everyone in the session
      const roomName = `session_${data.dto.sessionId}`;
      this.server.to(roomName).emit('activeDoctorChanged', {
        sessionId: data.dto.sessionId,
        newActiveDoctorId: data.dto.doctorId,
        session,
      });
      
      return {
        success: true,
        data: session,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error switching active doctor:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Send robot command (Master to Slave communication)
  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('sendRobotCommand')
  async handleSendRobotCommand(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { doctorId: number; sessionId: number; command: any },
  ) {
    try {
      const result = await this.blackboardService.sendRobotCommand(
        data.doctorId,
        data.sessionId,
        data.command,
      );
      
      // Broadcast to everyone in the session
      const roomName = `session_${data.sessionId}`;
      this.server.to(roomName).emit('robotCommandSent', {
        sessionId: data.sessionId,
        doctorId: data.doctorId,
        command: data.command,
        timestamp: new Date(),
      });
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error sending robot command:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Broadcast blackboard updates to all clients in a session
  broadcastBlackboardUpdate(sessionId: number, data: any) {
    const roomName = `session_${sessionId}`;
    this.server.to(roomName).emit('blackboardUpdated', data);
  }
}