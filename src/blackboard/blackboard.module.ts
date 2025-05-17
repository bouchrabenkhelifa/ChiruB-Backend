import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlackboardService } from './blackboard.service';
import { BlackboardController } from './blackboard.controller';

@Module({
  imports: [ConfigModule],
  controllers: [BlackboardController],
  providers: [BlackboardService],
  exports: [BlackboardService],
})
export class BlackboardModule {}