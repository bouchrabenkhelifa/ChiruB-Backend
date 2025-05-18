import { IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class GrantControlDto {
  @IsNumber()
  @IsNotEmpty()
  session_id: number;

  @IsNumber()
  @IsNotEmpty()
  controller_id: number;

  @IsDateString()
  @IsOptional()
  expires_at?: string;
}