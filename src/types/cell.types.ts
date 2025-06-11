import { ColumnType } from './column.types';

export interface CellLink {
  sheetId: string;
  rowId: string;
  columnId: string;
  sheetName: string;
  status: 'OK' | 'BROKEN' | 'INACCESSIBLE';
}

export interface CellImage {
  id: string;
  width: number;
  height: number;
  altText?: string;
  fileName?: string;
  format?: string;
  url?: string;
}

export interface CellLinkOut {
  columnId: string;
  rowId: string;
  sheetId: string;
  sheetName: string;
  status: 'OK' | 'BROKEN' | 'INACCESSIBLE';
}

export interface Cell {
  columnId: string;
  columnType?: ColumnType;
  value: any;
  displayValue?: string;
  format?: string;
  formula?: string;
  strict?: boolean;
  linkInFromCell?: CellLink;
  linkOutToCells?: CellLinkOut[];
  image?: CellImage;
  objectValue?: any;
  overrideValidation?: boolean;
  hyperlink?: {
    url: string;
    reportId?: string;
    sheetId?: string;
    sightId?: string;
  };
}
