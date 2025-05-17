import { Injectable } from '@nestjs/common';
import { SystemeTraitementService } from './Systeme-traitement-capteurs/systeme-traitement.service';

@Injectable()
export class BusinessControlService {
  constructor(private readonly systemeTraitementService: SystemeTraitementService) {}

  monitorAndAct(): string {
    return this.systemeTraitementService.processTemperature();
  }
}
