import { Injectable } from '@nestjs/common';

@Injectable()
export class DecaptorService {
  // Simuler un capteur défectueux
  private simulateFaultySensor = true; // tu peux le passer à false pour désactiver la panne

  readTemperatureFromCapteur1(): number {
    let temp;
    if (this.simulateFaultySensor) {
      temp = 100; // Valeur aberrante pour simuler la panne
    } else {
      temp = 36 + Math.random() * 2; // Valeur normale : 36-38°C
    }
    console.log(`[Hardware Layer] Capteur1 lit ${temp.toFixed(2)}°C`);
    return temp;
  }

  readTemperatureFromCapteur2(): number {
    const temp = 36 + Math.random() * 2; // Valeur normale
    console.log(`[Hardware Layer] Capteur2 lit ${temp.toFixed(2)}°C`);
    return temp;
  }
}
