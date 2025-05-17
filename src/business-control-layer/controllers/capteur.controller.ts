import { Controller, Get } from '@nestjs/common';
import { SystemeTraitementService } from '../Systeme-traitement-capteurs/systeme-traitement.service';


@Controller('capteurs')
export class CapteurController {
  constructor(private readonly systemeTraitementService: SystemeTraitementService) {}

  @Get('temperature')
  getTemperature() {
    return { result: this.systemeTraitementService.processTemperature() };
  }
}
