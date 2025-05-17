import { Controller, Get } from '@nestjs/common';
import { SystemeTraitementService } from '../Systeme-traitement-capteurs/systeme-traitement.service';

@Controller('business-control')
export class BusinessControlController {
  constructor(
    private readonly systemeTraitementService: SystemeTraitementService,
  ) {}

  @Get('monitor')
  monitorTemperature(): string {
    return this.systemeTraitementService.processTemperature();
  }
}
