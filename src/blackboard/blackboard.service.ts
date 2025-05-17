import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BlackboardPanel, PanelType } from './entities/blackboard.entity';
import { Proposition, PropositionStatus } from './entities/Proposition.entity';
import { Doctor, DoctorRole } from './entities/Doctor.entity';
import { Session, SessionStatus } from './entities/Session.entity';
import { CreatePropositionDto } from './dto/create-proposition.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { SwitchActiveDoctorDto } from './dto/switch-active-doctor.dto';

@Injectable()
export class BlackboardService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_KEY') || '',
    );
  }

  // Get blackboard data for a specific session
  async getBlackboard(sessionId: number): Promise<any> {
    // Get all panel data for the session
    const { data: patientData, error: patientError } = await this.supabase
      .from('blackboard_panels')
      .select('*')
      .eq('sessionId', sessionId)
      .eq('type', PanelType.PATIENT_DATA);

    const { data: videoData, error: videoError } = await this.supabase
      .from('blackboard_panels')
      .select('*')
      .eq('sessionId', sessionId)
      .eq('type', PanelType.VIDEO_STREAM);

    const { data: controlData, error: controlError } = await this.supabase
      .from('blackboard_panels')
      .select('*')
      .eq('sessionId', sessionId)
      .eq('type', PanelType.CONTROL_COMMANDS);

    const { data: communicationData, error: communicationError } = await this.supabase
      .from('blackboard_panels')
      .select('*')
      .eq('sessionId', sessionId)
      .eq('type', PanelType.COMMUNICATION);

    const { data: securityData, error: securityError } = await this.supabase
      .from('blackboard_panels')
      .select('*')
      .eq('sessionId', sessionId)
      .eq('type', PanelType.SECURITY);

    // Get propositions for the session
    const { data: propositions, error: propositionsError } = await this.supabase
      .from('propositions')
      .select(`
        *,
        doctor:doctorId(
          id,
          userId,
          role,
          isActive,
          user:userId(
            id,
            fullname,
            email
          )
        )
      `)
      .eq('sessionId', sessionId)
      .order('createdAt', { ascending: false });

    // Get session details including active doctor and medic chief
    const { data: sessionData, error: sessionError } = await this.supabase
      .from('sessions')
      .select(`
        *,
        activeDoctor:activeDoctorId(
          id,
          userId,
          user:userId(
            id,
            fullname,
            email
          )
        ),
        medicChief:medicChiefId(
          id,
          userId,
          user:userId(
            id,
            fullname,
            email
          )
        ),
        patient:patientId(
          id,
          fullname,
          medical_history
        )
      `)
      .eq('id', sessionId)
      .single();

    if (patientError || videoError || controlError || communicationError || 
        securityError || propositionsError || sessionError) {
      console.error('Error fetching blackboard data:', {
        patientError, videoError, controlError, communicationError, 
        securityError, propositionsError, sessionError
      });
      throw new Error('Failed to fetch blackboard data');
    }

    // Organize panels by level
    const organizeByLevel = (panels: any[] | null) => {
      const result: Record<number, any[]> = {};
      if (panels) {
        panels.forEach(panel => {
          if (!result[panel.level]) {
            result[panel.level] = [];
          }
          result[panel.level].push(panel);
        });
      }
      return result;
    };

    return {
      panels: {
        patient_data: organizeByLevel(patientData || []),
        video_stream: organizeByLevel(videoData || []),
        control_commands: organizeByLevel(controlData || []),
        communication: organizeByLevel(communicationData || []),
        security: organizeByLevel(securityData || []),
      },
      propositions,
      session: sessionData,
    };
  }

  // Add a new proposition from a doctor (knowledge source)
  async addProposition(createPropositionDto: CreatePropositionDto): Promise<Proposition> {
    const { doctorId, sessionId, content } = createPropositionDto;

    // Validate doctor is part of the session
    const { data: doctor, error: doctorError } = await this.supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .eq('sessionId', sessionId)
      .single();

    if (doctorError || !doctor) {
      throw new Error('Doctor not found or not part of this session');
    }

    // Insert proposition
    const { data, error } = await this.supabase
      .from('propositions')
      .insert([
        {
          doctorId,
          sessionId,
          content,
          status: PropositionStatus.PENDING,
          createdAt: new Date(),
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error adding proposition:', error);
      throw new Error('Failed to add proposition');
    }

    // Add proposition to communication panel
    await this.updatePanel({
      sessionId,
      panelType: PanelType.COMMUNICATION,
      level: 1, // Transcription level
      content: {
        type: 'proposition',
        doctorId,
        message: content,
        timestamp: new Date(),
      },
    });

    return data as Proposition;
  }

  // Update a panel in the blackboard
  async updatePanel(updatePanelDto: UpdatePanelDto): Promise<BlackboardPanel> {
    const { sessionId, panelType, level, content } = updatePanelDto;

    // Check if panel exists
    const { data: existingPanel, error: findError } = await this.supabase
      .from('blackboard_panels')
      .select('*')
      .eq('sessionId', sessionId)
      .eq('type', panelType)
      .eq('level', level)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error finding panel:', findError);
      throw new Error('Failed to check if panel exists');
    }

    let result;
    
    if (existingPanel) {
      // Update existing panel
      const { data, error } = await this.supabase
        .from('blackboard_panels')
        .update({ content })
        .eq('id', existingPanel.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating panel:', error);
        throw new Error('Failed to update panel');
      }

      result = data;
    } else {
      // Create new panel
      const { data, error } = await this.supabase
        .from('blackboard_panels')
        .insert([
          {
            sessionId,
            type: panelType,
            level,
            content,
            createdAt: new Date(),
          },
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating panel:', error);
        throw new Error('Failed to create panel');
      }

      result = data;
    }

    return result as BlackboardPanel;
  }

  // Switch active doctor (Master) - only medic chief can do this
  async switchActiveDoctor(
    medicChiefId: number, 
    switchActiveDoctorDto: SwitchActiveDoctorDto
  ): Promise<Session> {
    const { sessionId, doctorId } = switchActiveDoctorDto;

    // Verify medic chief is the scheduler for this session
    const { data: session, error: sessionError } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('medicChiefId', medicChiefId)
      .single();

    if (sessionError || !session) {
      throw new Error('Session not found or user is not the medic chief');
    }

    // Verify the new active doctor is part of the session
    const { data: doctor, error: doctorError } = await this.supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .eq('sessionId', sessionId)
      .single();

    if (doctorError || !doctor) {
      throw new Error('Doctor not found or not part of this session');
    }

    // Update the session with the new active doctor
    const { data: updatedSession, error: updateError } = await this.supabase
      .from('sessions')
      .update({ activeDoctorId: doctorId })
      .eq('id', sessionId)
      .select(`
        *,
        activeDoctor:activeDoctorId(
          id,
          userId,
          user:userId(
            id,
            fullname,
            email
          )
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating active doctor:', updateError);
      throw new Error('Failed to update active doctor');
    }

    // Update the control_commands panel to indicate the change
    await this.updatePanel({
      sessionId,
      panelType: PanelType.CONTROL_COMMANDS,
      level: 0, // Base level for control indication
      content: {
        type: 'doctor_switch',
        activeDoctorId: doctorId,
        timestamp: new Date(),
      },
    });

    return updatedSession as Session;
  }

  // Handle robot command from active doctor (Master to Slave communication)
  async sendRobotCommand(doctorId: number, sessionId: number, command: any): Promise<any> {
    // Verify user is the active doctor for this session
    const { data: session, error: sessionError } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('activeDoctorId', doctorId)
      .single();

    if (sessionError || !session) {
      throw new Error('Session not found or user is not the active doctor');
    }

    // Record command in the control_commands panel
    await this.updatePanel({
      sessionId,
      panelType: PanelType.CONTROL_COMMANDS,
      level: 1, // Command sequence level
      content: {
        type: 'robot_command',
        command,
        doctorId,
        timestamp: new Date(),
      },
    });

    // Here you would integrate with the actual robot control system
    // For simulation, we'll just return the command
    return {
      success: true,
      command,
      timestamp: new Date(),
    };
  }

  // Register a new doctor to a session
  async addDoctorToSession(
    sessionId: number,
    userId: number,
    role: DoctorRole,
    specialty: string,
  ): Promise<Doctor> {
    const { data, error } = await this.supabase
      .from('doctors')
      .insert([
        {
          userId,
          sessionId,
          role,
          isActive: false,
          specialty,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error adding doctor to session:', error);
      throw new Error('Failed to add doctor to session');
    }

    return data as Doctor;
  }
}