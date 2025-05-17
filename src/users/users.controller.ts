import { Controller, Get, Query, Param } from '@nestjs/common'; 
import { UsersService } from '../users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
async getusers() {
  const users = await this.usersService.getUsers();
  return users;
}

  @Get('docs')
async getDoctors() {
  const users = await this.usersService.getDoctors();
  return users;
}
  @Get('patients')
async getPatients() {
  const users = await this.usersService.getPatients();
  return users;
}


  @Get('findUser')
  async findUser(@Query('email') email: string) {
    const user = await this.usersService.finduserByEmail(email);
    return user || { message: 'User not found' };
  }

  @Get(':id') 
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(Number(id));
    if (!user) {
      return { message: 'Utilisateur non trouvé' };
    }
    return user;
  }
}
