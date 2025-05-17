import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  fullName: string;


  @IsString()
  telephone: string; 
  @IsString()
  role?: string; 

}
