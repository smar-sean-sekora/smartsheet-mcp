import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AddSheetRowsTool from '../../tools/AddSheetRowsTool.js';
import { SmartsheetAPI } from '../../apis/smartsheet-api.js';
import { mockEnvironmentVariables, restoreEnvironmentVariables } from '../test-utils.js';

// Mock the SmartsheetAPI
vi.mock('../../apis/smartsheet-api.js', () => ({
  SmartsheetAPI: vi.fn().mockImplementation(() => ({
    sheets: {
      addRows: vi.fn()
    }
  }))
}));

describe('AddSheetRowsTool', () => {
  let tool: AddSheetRowsTool;
  let mockAPI: any;

  beforeEach(() => {
    mockEnvironmentVariables();
    tool = new AddSheetRowsTool();
    mockAPI = {
      sheets: {
        addRows: vi.fn()
      }
    };
    (SmartsheetAPI as any).mockImplementation(() => mockAPI);
  });

  afterEach(() => {
    restoreEnvironmentVariables();
    vi.clearAllMocks();
  });

  it('should have correct name and description', () => {
    expect(tool.name).toBe('add-sheet-rows');
    expect(tool.description).toBe('Add new rows to a Smartsheet');
  });

  it('should add rows successfully', async () => {
    const mockResult = {
      result: [
        {
          id: 123456789,
          rowNumber: 1,
          cells: [
            { columnId: 1, value: 'Task 1' },
            { columnId: 2, value: 'In Progress' }
          ]
        }
      ]
    };

    mockAPI.sheets.addRows.mockResolvedValue(mockResult);

    const input = {
      sheetId: '987654321',
      rows: [
        {
          cells: [
            { columnId: 1, value: 'Task 1' },
            { columnId: 2, value: 'In Progress' }
          ],
          toBottom: true
        }
      ]
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.addRows).toHaveBeenCalledWith('987654321', input.rows);
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockResult, null, 2)
        }
      ]
    });
  });

  it('should add rows with hierarchical structure', async () => {
    const mockResult = {
      result: [
        {
          id: 123456789,
          parentId: 111111111,
          rowNumber: 2,
          cells: [
            { columnId: 1, value: 'Subtask 1' }
          ]
        }
      ]
    };

    mockAPI.sheets.addRows.mockResolvedValue(mockResult);

    const input = {
      sheetId: '987654321',
      rows: [
        {
          cells: [
            { columnId: 1, value: 'Subtask 1' }
          ],
          parentId: 111111111
        }
      ]
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.addRows).toHaveBeenCalledWith('987654321', input.rows);
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockResult, null, 2)
        }
      ]
    });
  });

  it('should add rows with formulas', async () => {
    const mockResult = {
      result: [
        {
          id: 123456789,
          cells: [
            { columnId: 1, value: 'Total' },
            { columnId: 2, formula: '=SUM(B1:B10)' }
          ]
        }
      ]
    };

    mockAPI.sheets.addRows.mockResolvedValue(mockResult);

    const input = {
      sheetId: '987654321',
      rows: [
        {
          cells: [
            { columnId: 1, value: 'Total' },
            { columnId: 2, formula: '=SUM(B1:B10)' }
          ]
        }
      ]
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.addRows).toHaveBeenCalledWith('987654321', input.rows);
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockResult, null, 2)
        }
      ]
    });
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error: Invalid column ID');
    mockAPI.sheets.addRows.mockRejectedValue(mockError);

    const input = {
      sheetId: '987654321',
      rows: [
        {
          cells: [
            { columnId: 999999, value: 'Invalid column' }
          ]
        }
      ]
    };

    const result = await tool.execute(input);

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'Failed to add rows: Error: API Error: Invalid column ID'
        }
      ]
    });
  });

  it('should validate schema correctly', () => {
    const schema = tool.schema;
    
    expect(schema.sheetId).toBeDefined();
    expect(schema.sheetId.description).toBe('The ID of the sheet to add rows to');
    
    expect(schema.rows).toBeDefined();
    expect(schema.rows.description).toBe('Array of row objects to add');
  });
});