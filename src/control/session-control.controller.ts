
// session-control.controller.ts
import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SessionControlService } from './session-control.service';
import { GrantControlDto } from './session-control.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('session-control')
@UseGuards(JwtAuthGuard)
export class SessionControlController {
  constructor(private readonly sessionControlService: SessionControlService) {}

  @Post('grant')
  async grantControl(@Body() dto: GrantControlDto, @Request() req) {
    return this.sessionControlService.grantControl(dto, req.user.id);
  }

  @Post(':sessionId/release')
  async releaseControl(@Param('sessionId') sessionId: string, @Request() req) {
    return this.sessionControlService.releaseControl(Number(sessionId), req.user.id);
  }

  @Post(':sessionId/current')
  async getCurrentController(@Param('sessionId') sessionId: string) {
    return this.sessionControlService.getCurrentController(Number(sessionId));
  }
}