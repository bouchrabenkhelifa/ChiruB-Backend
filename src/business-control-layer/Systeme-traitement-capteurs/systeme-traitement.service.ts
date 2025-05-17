import { Injectable } from '@nestjs/common';
import { DecaptorService } from '../../hardware-layer/decaptor.service';
import { DisactionerService } from '../../hardware-layer/disactioner.service';

@Injectable()
export class SystemeTraitementService {
  constructor(
    private readonly decaptorService: DecaptorService,
    private readonly disactionerService: DisactionerService,
  ) {}

  processTemperature(): string {
    const temp = this.decaptorService.readTemperature();

    console.log(`[Système Traitement Capteurs] Temperature read: ${temp.toFixed(2)}°C`);

    if (temp > 37.5) {
      const actionResult = this.disactionerService.executeAction('Move Arm to Cooling Position');
      console.log(`[Système Traitement Capteurs] High Temp Detected (${temp.toFixed(2)}°C). Action: ${actionResult}`);
      return `High temp detected: ${temp.toFixed(2)}°C. ${actionResult}`;
    } else {
      console.log(`[Système Traitement Capteurs] Temperature normal (${temp.toFixed(2)}°C). No action needed.`);
      return `Temperature normal: ${temp.toFixed(2)}°C. No action needed.`;
    }
  }
}
