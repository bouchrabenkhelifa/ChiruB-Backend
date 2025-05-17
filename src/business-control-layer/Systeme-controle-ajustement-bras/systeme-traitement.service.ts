import { Injectable } from '@nestjs/common';
import { DisactionerService } from '../../hardware-layer/disactioner.service';

@Injectable()
export class SystemeTraitementService {
  constructor(private readonly disactionerService: DisactionerService) {}

  processJoystickInput(data: { direction: string; angle: number; distance: number }) {
    // Logique métier ici : validation, transformation éventuelle...
    console.log('++ Données joystick reçues en couche métier:', data);

    // Appel à la couche matérielle
    return this.disactionerService.moveHardware(data.direction, data.angle, data.distance);
  }
}
