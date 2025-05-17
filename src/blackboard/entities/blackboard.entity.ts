
export class BlackboardPanel {
  id: number;
  sessionId: number;
  type: PanelType;
  content: any;
  level: number;
  createdAt: Date;
}
export enum PanelType {
  PATIENT_DATA = 'patient_data',
  VIDEO_STREAM = 'video_stream',
  CONTROL_COMMANDS = 'control_commands',
  COMMUNICATION = 'communication',
  SECURITY = 'security',
}