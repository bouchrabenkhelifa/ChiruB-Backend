import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsocketGateway } from './websocket.gateway';
import { BlackboardModule } from '../blackboard/blackboard.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';

@Module({
  imports: [
    ConfigModule,
    BlackboardModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [WebsocketGateway, JwtWsAuthGuard],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}