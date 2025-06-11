import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GetSheetRowsTool from '../../tools/GetSheetRowsTool.js';
import { SmartsheetAPI } from '../../apis/smartsheet-api.js';
import { mockEnvironmentVariables, restoreEnvironmentVariables } from '../test-utils.js';

// Mock the SmartsheetAPI
vi.mock('../../apis/smartsheet-api.js', () => ({
  SmartsheetAPI: vi.fn().mockImplementation(() => ({
    sheets: {
      getRow: vi.fn()
    }
  }))
}));

describe('GetSheetRowsTool', () => {
  let tool: GetSheetRowsTool;
  let mockAPI: any;

  beforeEach(() => {
    mockEnvironmentVariables();
    tool = new GetSheetRowsTool();
    mockAPI = {
      sheets: {
        getRow: vi.fn()
      }
    };
    (SmartsheetAPI as any).mockImplementation(() => mockAPI);
  });

  afterEach(() => {
    restoreEnvironmentVariables();
    vi.clearAllMocks();
  });

  it('should have correct name and description', () => {
    expect(tool.name).toBe('get-sheet-rows');
    expect(tool.description).toBe('GetSheetRows tool description');
  });

  it('should retrieve row successfully', async () => {
    const mockRow = {
      id: 111111111,
      sheetId: 123456789,
      cells: [
        { columnId: 1, value: 'Task 1' },
        { columnId: 2, value: 'In Progress' }
      ]
    };

    mockAPI.sheets.getRow.mockResolvedValue(mockRow);

    const input = {
      sheetId: '123456789',
      rowId: '111111111',
      include: 'columns,discussions'
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.getRow).toHaveBeenCalledWith(
      '123456789',
      '111111111',
      'columns,discussions'
    );
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockRow, null, 2)
        }
      ]
    });
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error: Row not found');
    mockAPI.sheets.getRow.mockRejectedValue(mockError);

    const input = {
      sheetId: '123456789',
      rowId: '999999999',
      include: 'columns'
    };

    const result = await tool.execute(input);

    expect(result).toBe('Failed to get row: Error: API Error: Row not found');
  });

  it('should validate schema correctly', () => {
    const schema = tool.schema;
    
    expect(schema.sheetId).toBeDefined();
    expect(schema.sheetId.description).toBe('The ID of the sheet to retrieve');
    
    expect(schema.rowId).toBeDefined();
    expect(schema.rowId.description).toBe('The ID of the row to retrieve');
    
    expect(schema.include).toBeDefined();
    expect(schema.include.description).toBe('Optional comma-separated list of elements to include');
  });
});