import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import {AuthModule} from './auth/auth.module'
import { SessionsModule } from './sessions/sessions.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    UsersModule,AuthModule, SessionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
