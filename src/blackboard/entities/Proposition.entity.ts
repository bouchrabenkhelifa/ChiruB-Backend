export class Proposition {
  id: number;
  sessionId: number;
  doctorId: number;
  content: string;
  status: PropositionStatus;
  createdAt: Date;
}
export enum PropositionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}