export class Session {
  id: number;
  name: string;
  patientId: number;
  hospitalId: number;
  medicChiefId: number;
  activeDoctorId: number | null;
  status: SessionStatus;
  createdAt: Date;
}

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}