import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';

// Import your new services and controller
import { SystemeTraitementService } from './business-control-layer/Systeme-traitement-capteurs/systeme-traitement.service';
import { DecaptorService } from './hardware-layer/decaptor.service';
import { DisactionerService } from './hardware-layer/disactioner.service';
import { CapteurController } from './business-control-layer/controllers/capteur.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    SessionsModule,
  ],
  controllers: [
    AppController,
    CapteurController,  // Add your new controller here
  ],
  providers: [
    AppService,
    SystemeTraitementService,  // Add your new services here
    DecaptorService,
    DisactionerService,
  ],
})
export class AppModule {}
