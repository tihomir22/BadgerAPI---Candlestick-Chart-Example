import { historicRegistry } from './historicRegistry';

export interface historicWrapper {
    period: string;
    numRecords: string;
    rawHistoricData: Array<historicRegistry>;
  }
  