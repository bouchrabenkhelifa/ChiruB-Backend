import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';

// Sensor processing (capteur)
import { SystemeTraitementService as CapteurSystemeTraitementService } from './business-control-layer/Systeme-traitement-capteurs/systeme-traitement.service';
import { DecaptorService } from './hardware-layer/decaptor.service';
import { DisactionerService } from './hardware-layer/disactioner.service';
import { CapteurController } from './business-control-layer/controllers/capteur.controller';

// Joystick movement
import { JoystickController } from './business-control-layer/controllers/joystick.controller';
import { SystemeTraitementService as JoystickSystemeTraitementService } from './business-control-layer/Systeme-controle-ajustement-bras/systeme-traitement.service';

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
    CapteurController,
    JoystickController,
  ],
  providers: [
    AppService,
    CapteurSystemeTraitementService,
    JoystickSystemeTraitementService,
    DecaptorService,
    DisactionerService,
  ],
})
export class AppModule {}
