export interface Contact {
  id: number;
  campaignId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  status: ContactStatus;
  lastCallDate?: Date;
  attempts: number;
  notes?: string;
  scheduleCallback?: Date;
  timeZone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  callHistory?: Call[];
}

export enum ContactStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  NO_ANSWER = 'NO_ANSWER',
  BUSY = 'BUSY',
  INVALID = 'INVALID',
  DO_NOT_CALL = 'DO_NOT_CALL'
}

export interface ImportContactsRequest {
  campaignId: number;
  file: File;
  mapping: ColumnMapping;
}

export interface ColumnMapping {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors?: ImportError[];
}

export interface ImportError {
  row: number;
  message: string;
  data: any;
}

import { Call } from './call.model';
