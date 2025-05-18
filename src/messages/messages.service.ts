// messages.service.ts
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { CreateMessageDto, MessageType, MessageStatus } from './messages.dto';

@Injectable()
export class MessagesService {
  private supabase: SupabaseClient;
  
  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!
    );
  }

  async createMessage(dto: CreateMessageDto) {
    const { data, error } = await this.supabase
      .from('message')
      .insert([dto])
      .select();

    if (error) {
      console.error('Error creating message:', error);
      throw new Error(error.message);
    }
    return data[0];
  }

  async getSessionMessages(sessionId: number) {
    const { data, error } = await this.supabase
      .from('message')
      .select(`
        *,
        sender:sender_id (
          id,
          fullname,
          role
        )
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching session messages:', error);
      throw new Error(error.message);
    }
    return data;
  }

  async updateMessageStatus(messageId: number, status: MessageStatus) {
    const { data, error } = await this.supabase
      .from('message')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', messageId)
      .select();

    if (error) {
      console.error('Error updating message status:', error);
      throw new Error(error.message);
    }
    return data[0];
  }
}

