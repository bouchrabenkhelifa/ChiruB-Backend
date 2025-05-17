import { IsNotEmpty, IsNumber } from 'class-validator';

export class SwitchActiveDoctorDto {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number;

  @IsNotEmpty()
  @IsNumber()
  doctorId: number;
}