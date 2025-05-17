import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
  providers: [SessionsService],
  controllers: [SessionsController]
})
export class SessionsModule {}
