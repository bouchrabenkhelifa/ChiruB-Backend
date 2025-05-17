import { Controller, Get, Query, Param ,Body,Post} from '@nestjs/common'; 
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './create-session.dto';
@Controller('sessions')
export class SessionsController {
      constructor(private readonly sessionsService: SessionsService) {}
    
    @Get('all')
    async getsessions() {
      const users = await this.sessionsService.getSessions();
      return users;
    }
  @Post()
  async create(@Body() dto: CreateSessionDto) {
    return this.sessionsService.create(dto);
  }

  @Get('hos')
async getHospitals() {
  const hospitals = await this.sessionsService.getHospitals();
  return hospitals;
}
}
