import { Controller, Post, Body } from '@nestjs/common';
import { SystemeTraitementService } from '../Systeme-controle-ajustement-bras/systeme-traitement.service';
import { DisactionerService } from '../../hardware-layer/disactioner.service';
@Controller('joystick')
export class JoystickController {
  constructor(private readonly systemeTraitementService: SystemeTraitementService) {}

  @Post('move')
  handleJoystickMovement(@Body() data: { direction: string; angle: number; distance: number }) {
    return this.systemeTraitementService.processJoystickInput(data);
  }
}
