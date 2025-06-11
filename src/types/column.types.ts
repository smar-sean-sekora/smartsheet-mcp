import { User } from './base.types';

export enum ColumnType {
  TEXT_NUMBER = 'TEXT_NUMBER',
  PICKLIST = 'PICKLIST',
  MULTI_PICKLIST = 'MULTI_PICKLIST',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  ABSTRACT_DATETIME = 'ABSTRACT_DATETIME',
  CONTACT_LIST = 'CONTACT_LIST',
  MULTI_CONTACT_LIST = 'MULTI_CONTACT_LIST',
  CHECKBOX = 'CHECKBOX',
  DURATION = 'DURATION',
  PREDECESSOR = 'PREDECESSOR'
}

export interface AutoNumberFormat {
  prefix?: string;
  suffix?: string;
  fill?: string;
  startingNumber?: number;
}

export interface Column {
  id: string;
  index: number;
  title: string;
  type: ColumnType;
  primary: boolean;
  width: number;
  locked: boolean;
  hidden: boolean;
  format?: string;
  description?: string;
  options?: string[];
  symbol?: string;
  systemColumnType?: string;
  autoNumberFormat?: AutoNumberFormat;
  validation?: boolean;
  tags?: string[];
  createdBy?: User;
  modifiedBy?: User;
  createdAt?: string;
  modifiedAt?: string;
}
