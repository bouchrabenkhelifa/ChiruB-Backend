import { Controller, Get, Query, Param } from '@nestjs/common'; 
import { SessionsService } from './sessions.service';
@Controller('sessions')
export class SessionsController {
      constructor(private readonly sessionsService: SessionsService) {}
    
    @Get('all')
    async getsessions() {
      const users = await this.sessionsService.getSessions();
      return users;
    }
    
}
