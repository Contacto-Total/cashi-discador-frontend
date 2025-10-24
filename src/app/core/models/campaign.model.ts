export interface Campaign {
  id: number;
  name: string;
  description?: string;
  status: CampaignStatus;
  dialMode: DialMode;
  startDate?: Date;
  endDate?: Date;
  maxAttempts: number;
  retryInterval: number;
  callerId?: string;
  aggressiveness: number;
  createdBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  statistics?: CampaignStatistics;
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export enum DialMode {
  MANUAL = 'MANUAL',
  PROGRESSIVE = 'PROGRESSIVE',
  PREDICTIVE = 'PREDICTIVE'
}

export interface CampaignStatistics {
  totalContacts: number;
  contactedContacts: number;
  pendingContacts: number;
  totalCalls: number;
  answeredCalls: number;
  successRate: number;
  averageDuration: number;
}
