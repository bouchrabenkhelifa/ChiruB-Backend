// decaptor.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DecaptorService {
  readTemperature(): number {
    const temp = 36 + Math.random() * 2; // Simulate 36-38°C
    console.log(`[Hardware Layer] Decaptor reads ${temp.toFixed(2)}°C`);
    return temp;
  }
}