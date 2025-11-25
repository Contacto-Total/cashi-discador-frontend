export interface PhoneLine {
  modality: string;
  phoneNumber: string;
  carrier: string;
}

export interface PhoneLineResponse {
  documentNumber: string;
  documentType: string;
  phoneLines: PhoneLine[];
  totalLines: number;
  queryDate: string;
  cached: boolean;
  status: string;
  message: string;
}
