import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UpdateSheetRowsTool from '../../tools/UpdateSheetRowsTool.js';
import { SmartsheetAPI } from '../../apis/smartsheet-api.js';
import { mockEnvironmentVariables, restoreEnvironmentVariables } from '../test-utils.js';

// Mock the SmartsheetAPI
vi.mock('../../apis/smartsheet-api.js', () => ({
  SmartsheetAPI: vi.fn().mockImplementation(() => ({
    sheets: {
      updateRows: vi.fn()
    }
  }))
}));

describe('UpdateSheetRowsTool', () => {
  let tool: UpdateSheetRowsTool;
  let mockAPI: any;

  beforeEach(() => {
    mockEnvironmentVariables();
    tool = new UpdateSheetRowsTool();
    mockAPI = {
      sheets: {
        updateRows: vi.fn()
      }
    };
    (SmartsheetAPI as any).mockImplementation(() => mockAPI);
  });

  afterEach(() => {
    restoreEnvironmentVariables();
    vi.clearAllMocks();
  });

  it('should have correct name and description', () => {
    expect(tool.name).toBe('update-sheet-rows');
    expect(tool.description).toBe('UpdateSheetRows tool description');
  });

  it('should update rows successfully', async () => {
    const mockResult = {
      result: [
        {
          id: 123456789,
          cells: [
            { columnId: 1, value: 'Updated Task' },
            { columnId: 2, value: 'Complete' }
          ]
        }
      ]
    };

    mockAPI.sheets.updateRows.mockResolvedValue(mockResult);

    const input = {
      sheetId: '987654321',
      rows: [
        {
          id: 123456789,
          cells: [
            { columnId: 1, value: 'Updated Task' },
            { columnId: 2, value: 'Complete' }
          ]
        }
      ]
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.updateRows).toHaveBeenCalledWith('987654321', input.rows);
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockResult, null, 2)
        }
      ]
    });
  });

  it('should update rows with formulas', async () => {
    const mockResult = {
      result: [
        {
          id: 123456789,
          cells: [
            { columnId: 1, value: 'Total' },
            { columnId: 2, formula: '=SUM(B1:B10)', value: 100 }
          ]
        }
      ]
    };

    mockAPI.sheets.updateRows.mockResolvedValue(mockResult);

    const input = {
      sheetId: '987654321',
      rows: [
        {
          id: 123456789,
          cells: [
            { columnId: 1, value: 'Total' },
            { columnId: 2, formula: '=SUM(B1:B10)' }
          ]
        }
      ]
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.updateRows).toHaveBeenCalledWith('987654321', input.rows);
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockResult, null, 2)
        }
      ]
    });
  });

  it('should validate schema correctly', () => {
    const schema = tool.schema;
    
    expect(schema.sheetId).toBeDefined();
    expect(schema.sheetId.description).toBe('The ID of the sheet to update');
    
    expect(schema.rows).toBeDefined();
    expect(schema.rows.description).toBe('Array of row objects to update');
  });
});