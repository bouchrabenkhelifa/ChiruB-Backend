import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateSessionDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  hopital_id: number;
    @IsNumber()
  patient_id: number;

  @IsNumber()
  medecin_chef_id: number;

  @IsNumber()
  medecin1_id: number;

  @IsNumber()
  medecin2_id: number;
  
  @IsString()
  @IsNotEmpty()
  description: string;
}