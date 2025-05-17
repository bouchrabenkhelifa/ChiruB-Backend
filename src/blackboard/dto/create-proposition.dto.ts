import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePropositionDto {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number;

  @IsNotEmpty()
  @IsNumber()
  doctorId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
