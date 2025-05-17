import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { PanelType } from '../entities/blackboard.entity';

export class UpdatePanelDto {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number;

  @IsNotEmpty()
  @IsEnum(PanelType)
  panelType: PanelType;

  @IsNotEmpty()
  @IsNumber()
  level: number;

  @IsNotEmpty()
  content: any;
}
