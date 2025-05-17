import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { BlackboardService } from './blackboard.service';
import { CreatePropositionDto } from './dto/create-proposition.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { SwitchActiveDoctorDto } from './dto/switch-active-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('blackboard')
@UseGuards(JwtAuthGuard)
export class BlackboardController {
  constructor(private readonly blackboardService: BlackboardService) {}

  @Get('session/:sessionId')
  async getBlackboard(@Param('sessionId') sessionId: string) {
    return this.blackboardService.getBlackboard(Number(sessionId));
  }

  @Post('proposition')
  async addProposition(@Body() createPropositionDto: CreatePropositionDto) {
    return this.blackboardService.addProposition(createPropositionDto);
  }

  @Put('panel')
  async updatePanel(@Body() updatePanelDto: UpdatePanelDto) {
    return this.blackboardService.updatePanel(updatePanelDto);
  }

  @Put('active-doctor')
  async switchActiveDoctor(
    @Request() req,
    @Body() switchActiveDoctorDto: SwitchActiveDoctorDto,
  ) {
    // This assumes your JWT token has a doctorId property
    // If your user object structure is different, adjust accordingly
    const medicChiefId = req.user.doctorId; 
    return this.blackboardService.switchActiveDoctor(
      medicChiefId, 
      switchActiveDoctorDto
    );
  }

  @Post('robot-command')
  async sendRobotCommand(
    @Request() req,
    @Body() commandData: { sessionId: number; command: any },
  ) {
    const doctorId = req.user.doctorId;
    return this.blackboardService.sendRobotCommand(
      doctorId,
      commandData.sessionId,
      commandData.command,
    );
  }
}