import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GetSheetByUrlTool from '../../tools/GetSheetByUrlTool.js';
import { SmartsheetAPI } from '../../apis/smartsheet-api.js';
import { mockEnvironmentVariables, restoreEnvironmentVariables } from '../test-utils.js';

// Mock the SmartsheetAPI
vi.mock('../../apis/smartsheet-api.js', () => ({
  SmartsheetAPI: vi.fn().mockImplementation(() => ({
    sheets: {
      getSheetByDirectIdToken: vi.fn()
    }
  }))
}));

describe('GetSheetByUrlTool', () => {
  let tool: GetSheetByUrlTool;
  let mockAPI: any;

  beforeEach(() => {
    mockEnvironmentVariables();
    tool = new GetSheetByUrlTool();
    mockAPI = {
      sheets: {
        getSheetByDirectIdToken: vi.fn()
      }
    };
    (SmartsheetAPI as any).mockImplementation(() => mockAPI);
  });

  afterEach(() => {
    restoreEnvironmentVariables();
    vi.clearAllMocks();
  });

  it('should have correct name and description', () => {
    expect(tool.name).toBe('get-sheet-by-url');
    expect(tool.description).toBe('Retrieves the current state of a sheet, including rows, columns, and cells');
  });

  it('should extract sheet ID from URL and fetch sheet successfully', async () => {
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

    mockAPI.sheets.getSheetByDirectIdToken.mockResolvedValue(mockSheet);

    const input = {
      url: 'https://app.smartsheet.com/sheets/abc123def456'
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.getSheetByDirectIdToken).toHaveBeenCalledWith(
      'abc123def456',
      undefined,
      undefined,
      undefined,
      undefined
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

  it('should handle invalid URL format', async () => {
    const input = {
      url: 'https://app.smartsheet.com/invalid-url'
    };

    const result = await tool.execute(input);

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'Failed to get sheet: Invalid URL format'
        }
      ],
      isError: true
    });
    expect(mockAPI.sheets.getSheetByDirectIdToken).not.toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error: Sheet not found');
    mockAPI.sheets.getSheetByDirectIdToken.mockRejectedValue(mockError);

    const input = {
      url: 'https://app.smartsheet.com/sheets/abc123def456'
    };

    const result = await tool.execute(input);

    expect(result).toBe('Failed to get sheet: Error: API Error: Sheet not found');
  });

  it('should validate schema correctly', () => {
    const schema = tool.schema;
    
    expect(schema.url).toBeDefined();
    expect(schema.url.description).toBe('The URL of the sheet to retrieve');
  });
});