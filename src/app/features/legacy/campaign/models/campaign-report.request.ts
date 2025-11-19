export interface CampaignReportRequest {
  campaignName: string;
  filterType?: string;
  dueDates?: string[];
  directContactRanges: RangeRequest[];
  indirectContactRanges: RangeRequest[];
  brokenPromisesRanges: RangeRequest[];
  notContactedRanges: RangeRequest[];
  content?: boolean;
  excluirPagadasHoy?: boolean;
}

export interface RangeRequest {
  min: string;
  max: string; // '+' for unlimited ranges
}
