export interface Range {
  min: number;
  max: number;
  isChecked: boolean;
}

export interface CampaignRanges {
  contactoDirecto: Range[];
  contactoIndirecto: Range[];
  promesasRotas: Range[];
  noContactado: Range[];
}
