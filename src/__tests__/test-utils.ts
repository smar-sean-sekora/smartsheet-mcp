import { vi } from 'vitest';

export class MockSmartsheetAPI {
  sheets: MockSmartsheetSheetAPI;

  constructor() {
    this.sheets = new MockSmartsheetSheetAPI();
  }
}

export class MockSmartsheetSheetAPI {
  createSheet = vi.fn();
  addRows = vi.fn();
  updateRows = vi.fn();
  deleteRows = vi.fn();
  getSheet = vi.fn();
  getRow = vi.fn();
}

export function createMockSmartsheetAPI() {
  return new MockSmartsheetAPI();
}

export const mockEnvironmentVariables = () => {
  process.env.SMARTSHEET_API_KEY = 'test-api-key';
  process.env.SMARTSHEET_ENDPOINT = 'https://api.smartsheet.com/2.0';
};

export const restoreEnvironmentVariables = () => {
  delete process.env.SMARTSHEET_API_KEY;
  delete process.env.SMARTSHEET_ENDPOINT;
};