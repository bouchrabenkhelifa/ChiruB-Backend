// session-control.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { GrantControlDto } from './session-control.dto';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class SessionControlService {
  private supabase: SupabaseClient;
  
  constructor(
    private configService: ConfigService,
    private sessionsService: SessionsService
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!
    );
  }

  async getCurrentController(sessionId: number) {
    const { data, error } = await this.supabase
      .from('session_control')
      .select(`
        *,
        controller:controller_id (
          id,
          fullname,
          role
        )
      `)
      .eq('session_id', sessionId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned"
      console.error('Error fetching current controller:', error);
      throw new Error(error.message);
    }
    return data;
  }

  async grantControl(dto: GrantControlDto, granterId: number) {
    // First check if granter is the médecin chef of the session
    const session = await this.getSessionById(dto.session_id);
    if (!session || session.medecin_chef_id !== granterId) {
      throw new ForbiddenException('Only the médecin chef can grant control');
    }

    // End any active control sessions
    await this.supabase
      .from('session_control')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('session_id', dto.session_id)
      .eq('status', 'active');

    // Create new control session
    const { data, error } = await this.supabase
      .from('session_control')
      .insert([dto])
      .select();

    if (error) {
      console.error('Error granting control:', error);
      throw new Error(error.message);
    }
    return data[0];
  }
// Add this method to your existing SessionsService

async getSessionById(sessionId: number) {
  const { data, error } = await this.supabase
    .from('session')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }
  return data;
}
  async releaseControl(sessionId: number, userId: number) {
    const currentControl = await this.getCurrentController(sessionId);
    
    if (!currentControl || currentControl.controller_id !== userId) {
      throw new ForbiddenException('You do not have control of this session');
    }

    const { data, error } = await this.supabase
      .from('session_control')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', currentControl.id)
      .select();

    if (error) {
      console.error('Error releasing control:', error);
      throw new Error(error.message);
    }
    return data[0];
  }
}
