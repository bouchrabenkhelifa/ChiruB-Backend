import { Injectable } from '@nestjs/common';
import { DecaptorService } from '../../hardware-layer/decaptor.service';
import { DisactionerService } from '../../hardware-layer/disactioner.service';

@Injectable()
export class SystemeTraitementService {
  constructor(
    private readonly decaptorService: DecaptorService,
    private readonly disactionerService: DisactionerService,
  ) {}

  // Méthode avec redondance de capteurs
  processTemperature(): string {
    let temp = this.decaptorService.readTemperatureFromCapteur1();

    console.log(`[SystemeTraitementService] Lecture Capteur 1 : ${temp.toFixed(2)}°C`);

    // Si la valeur est aberrante, on bascule vers le capteur 2
    if (temp > 45 || temp < 30) {
      console.warn(`[SystemeTraitementService] ⚠️ Capteur 1 défectueux (valeur aberrante : ${temp.toFixed(2)}°C). Bascule vers Capteur 2.`);
      temp = this.decaptorService.readTemperatureFromCapteur2();
      console.log(`[SystemeTraitementService] Lecture Capteur 2 : ${temp.toFixed(2)}°C`);
    }

    if (temp > 37.5) {
      const actionResult = this.disactionerService.executeAction('Move Arm to Cooling Position');
      console.log(`[SystemeTraitementService] Haute Température détectée (${temp.toFixed(2)}°C). Action déclenchée.`);
      return `⚠️ Température élevée: ${temp.toFixed(2)}°C. ${actionResult}`;
    } else {
      console.log(`[SystemeTraitementService] Température normale (${temp.toFixed(2)}°C). Aucun mouvement requis.`);
      return `✅ Température normale: ${temp.toFixed(2)}°C. Aucun mouvement.`;
    }
  }
}
