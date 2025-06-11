import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GetSheetByIdTool from '../../tools/GetSheetByIdTool.js';
import { SmartsheetAPI } from '../../apis/smartsheet-api.js';
import { mockEnvironmentVariables, restoreEnvironmentVariables } from '../test-utils.js';

// Mock the SmartsheetAPI
vi.mock('../../apis/smartsheet-api.js', () => ({
  SmartsheetAPI: vi.fn().mockImplementation(() => ({
    sheets: {
      getSheet: vi.fn()
    }
  }))
}));

describe('GetSheetByIdTool', () => {
  let tool: GetSheetByIdTool;
  let mockAPI: any;

  beforeEach(() => {
    mockEnvironmentVariables();
    tool = new GetSheetByIdTool();
    mockAPI = {
      sheets: {
        getSheet: vi.fn()
      }
    };
    (SmartsheetAPI as any).mockImplementation(() => mockAPI);
  });

  afterEach(() => {
    restoreEnvironmentVariables();
    vi.clearAllMocks();
  });

  it('should have correct name and description', () => {
    expect(tool.name).toBe('get-sheet-by-id');
    expect(tool.description).toBe('GetSheetById tool description');
  });

  it('should get sheet successfully', async () => {
    const mockSheet = {
      id: 123456789,
      name: 'Test Sheet',
      columns: [
        { id: 1, title: 'Task', type: 'TEXT_NUMBER', primary: true },
        { id: 2, title: 'Status', type: 'PICKLIST' }
      ],
      rows: [
        {
          id: 111111111,
          cells: [
            { columnId: 1, value: 'Task 1' },
            { columnId: 2, value: 'In Progress' }
          ]
        }
      ]
    };

    mockAPI.sheets.getSheet.mockResolvedValue(mockSheet);

    const input = {
      sheetId: '123456789',
      include: 'columns,rows',
      pageSize: 100,
      page: 1
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.getSheet).toHaveBeenCalledWith(
      '123456789',
      'columns,rows',
      undefined,
      100,
      1
    );
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockSheet, null, 2)
        }
      ]
    });
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error: Sheet not found');
    mockAPI.sheets.getSheet.mockRejectedValue(mockError);

    const input = {
      sheetId: '999999999',
      include: '',
      pageSize: 100,
      page: 1
    };

    const result = await tool.execute(input);

    expect(result).toBe('Failed to get sheet: Error: API Error: Sheet not found');
  });

  it('should validate schema correctly', () => {
    const schema = tool.schema;
    
    expect(schema.sheetId).toBeDefined();
    expect(schema.sheetId.description).toBe('The ID of the sheet to retrieve');
    
    expect(schema.include).toBeDefined();
    expect(schema.include.description).toBe('Optional comma-separated list of elements to include');
    
    expect(schema.pageSize).toBeDefined();
    expect(schema.pageSize.description).toBe('Optional page size');
    
    expect(schema.page).toBeDefined();
    expect(schema.page.description).toBe('Optional page number');
  });
});