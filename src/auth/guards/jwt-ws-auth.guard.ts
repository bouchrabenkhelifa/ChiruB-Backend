import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const client = context.switchToWs().getClient();
      const token = this.extractTokenFromHeader(client.handshake);
      
      if (!token) {
        throw new WsException('Invalid token');
      }
      
      const payload = this.jwtService.verify(token);
      
      // Attach user to socket
      client.user = payload;
      
      return true;
    } catch (err) {
      throw new WsException('Unauthorized access');
    }
  }

  private extractTokenFromHeader(handshake: any): string | undefined {
    const authHeader = handshake.headers.authorization;
    if (!authHeader) return undefined;
    
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}