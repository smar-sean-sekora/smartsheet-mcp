export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

export interface Link {
  type: string;
  sheetId: string;
  viewId?: string;
  reportId?: string;
  url: string;
  columnId?: string;
  rowId?: string;
}

export interface Format {
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  horizontalAlign?: 'LEFT' | 'CENTER' | 'RIGHT';
  verticalAlign?: 'TOP' | 'MIDDLE' | 'BOTTOM';
  textWrap?: boolean;
  color?: string;
  backgroundColor?: string;
  numberFormat?: string;
  thousandsSeparator?: boolean;
  decimalPlaces?: number;
  currencySymbol?: string;
  textFormat?: 'TEXT' | 'NUMBER' | 'PERCENT' | 'CURRENCY' | 'DATE' | 'DURATION' | 'CHECKBOX' | 'STAR' | 'FLAG';
}

export interface ErrorResponse {
  errorCode: number;
  message: string;
  refId?: string;
  detail?: {
    index?: number;
    rowId?: string;
    columnId?: string;
    [key: string]: any;
  };
}
