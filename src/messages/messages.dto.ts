// messages.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';

export enum MessageType {
  MESSAGE = 'message',
  PROPOSITION = 'proposition',
  CONTROL_REQUEST = 'control_request'
}

export enum MessageStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  session_id: number;

  @IsNumber()
  @IsNotEmpty()
  sender_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  @IsNotEmpty()
  type: MessageType;
}

