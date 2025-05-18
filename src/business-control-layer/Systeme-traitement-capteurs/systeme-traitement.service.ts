import { Injectable } from '@nestjs/common';
import { DecaptorService } from '../../hardware-layer/decaptor.service';
import { DisactionerService } from '../../hardware-layer/disactioner.service';

@Injectable()
export class SystemeTraitementService {
  constructor(
    private readonly decaptorService: DecaptorService,
    private readonly disactionerService: DisactionerService,
  ) {}

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
