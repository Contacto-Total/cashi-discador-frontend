export interface AgentStatus {
  id: number;
  agentId: number;
  status: AgentState;
  campaignId?: number;
  startTime: Date;
  endTime?: Date;
  reason?: string;
  agentName?: string;
}

export enum AgentState {
  OFFLINE = 'OFFLINE',
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  BREAK = 'BREAK',
  AFTER_CALL_WORK = 'AFTER_CALL_WORK'
}

export interface ChangeStatusRequest {
  status: AgentState;
  reason?: string;
  campaignId?: number;
}

export interface AgentPerformance {
  agentId: number;
  agentName: string;
  totalCalls: number;
  answeredCalls: number;
  totalTalkTime: number;
  averageTalkTime: number;
  successfulContacts: number;
  availableTime: number;
  breakTime: number;
}
