import { Module } from '@nestjs/common';
import { DecaptorService } from './decaptor.service';
import { DisactionerService } from './disactioner.service';

@Module({
  providers: [DecaptorService, DisactionerService],
  exports: [DecaptorService, DisactionerService], // So Business Layer can use them
})
export class HardwareLayerModule {}
