import { Injectable } from '@nestjs/common';


@Injectable()
export class DisactionerService {
  executeAction(command: string): string {
    console.log(`[DisactionerService] Executing action: ${command}`);
    // Remplacer ceci par l'envoi de commande au matériel (GPIO, UART, etc.)
    return `Action "${command}" executed successfully.`;
  }

    moveHardware(direction: string, angle: number, distance: number): any {
    // Your hardware control logic here
    return `Moving ${direction} at angle ${angle} and distance ${distance}`;
  }
}




