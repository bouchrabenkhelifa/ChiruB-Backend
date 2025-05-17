import { Injectable } from '@nestjs/common';

@Injectable()
export class DisactionerService {
  executeAction(action: string): string {
    console.log(`[Hardware Layer] Disactioner: Executing action -> ${action}`);
    return `Action "${action}" executed`;
  }
}
