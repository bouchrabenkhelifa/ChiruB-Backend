export class Doctor {
  id: number;
  userId: number;
  sessionId: number;
  role: DoctorRole;
  isActive: boolean;
  specialty: string;
}
export enum DoctorRole {
  CHIEF = 'chief',
  SPECIALIST = 'specialist',
  ACTIVE = 'active',
}