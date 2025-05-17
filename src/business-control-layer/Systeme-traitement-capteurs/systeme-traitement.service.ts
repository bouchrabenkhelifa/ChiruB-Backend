import { Injectable } from '@nestjs/common';
import { DecaptorService } from '../../hardware-layer/decaptor.service';
import { DisactionerService } from '../../hardware-layer/disactioner.service';

@Injectable()
export class SystemeTraitementService {
  constructor(
    private readonly decaptorService: DecaptorService,
    private readonly disactionerService: DisactionerService,
  ) {}

  // Existing joystick input processing
  processJoystickInput(data: { direction: string; angle: number; distance: number }): string {
    const { direction, angle, distance } = data;
    console.log(`[SystemeTraitementService] Received joystick data - Direction: ${direction}, Angle: ${angle}, Distance: ${distance}`);

    let action = '';

    switch (direction) {
      case 'up':
        action = 'Move Arm Up';
        break;
      case 'down':
        action = 'Move Arm Down';
        break;
      case 'left':
        action = 'Rotate Arm Left';
        break;
      case 'right':
        action = 'Rotate Arm Right';
        break;
      default:
        action = 'Stop Arm Movement';
        break;
    }

    const result = this.disactionerService.executeAction(action);
    return `Joystick movement processed: ${result}`;
  }

  // New method to process temperature
  processTemperature(): string {
    const temp = this.decaptorService.readTemperature();

    console.log(`[SystemeTraitementService] Temperature read: ${temp.toFixed(2)}°C`);

    if (temp > 37.5) {
      const actionResult = this.disactionerService.executeAction('Move Arm to Cooling Position');
      console.log(`[SystemeTraitementService] High Temp Detected (${temp.toFixed(2)}°C). Action: ${actionResult}`);
      return `High temp detected: ${temp.toFixed(2)}°C. ${actionResult}`;
    } else {
      console.log(`[SystemeTraitementService] Temperature normal (${temp.toFixed(2)}°C). No action needed.`);
      return `Temperature normal: ${temp.toFixed(2)}°C. No action needed.`;
    }
  }
}
