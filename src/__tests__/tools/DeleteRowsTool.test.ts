import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DeleteRowsTool from '../../tools/DeleteRowsTool.js';
import { SmartsheetAPI } from '../../apis/smartsheet-api.js';
import { mockEnvironmentVariables, restoreEnvironmentVariables } from '../test-utils.js';

// Mock the SmartsheetAPI
vi.mock('../../apis/smartsheet-api.js', () => ({
  SmartsheetAPI: vi.fn().mockImplementation(() => ({
    sheets: {
      deleteRows: vi.fn()
    }
  }))
}));

describe('DeleteRowsTool', () => {
  let tool: DeleteRowsTool;
  let mockAPI: any;

  beforeEach(() => {
    mockEnvironmentVariables();
    tool = new DeleteRowsTool();
    mockAPI = {
      sheets: {
        deleteRows: vi.fn()
      }
    };
    (SmartsheetAPI as any).mockImplementation(() => mockAPI);
  });

  afterEach(() => {
    restoreEnvironmentVariables();
    vi.clearAllMocks();
  });

  it('should have correct name and description', () => {
    expect(tool.name).toBe('delete-rows');
    expect(tool.description).toBe('Deletes rows from a sheet');
  });

  it('should delete rows successfully', async () => {
    const mockResult = {
      message: 'SUCCESS',
      result: [
        { id: 111111111, success: true },
        { id: 222222222, success: true }
      ]
    };

    mockAPI.sheets.deleteRows.mockResolvedValue(mockResult);

    const input = {
      sheetId: '123456789',
      rowIds: ['111111111', '222222222'],
      ignoreRowsNotFound: true
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.deleteRows).toHaveBeenCalledWith(
      '123456789',
      ['111111111', '222222222'],
      true
    );
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockResult, null, 2)
        }
      ]
    });
  });

  it('should use default value for ignoreRowsNotFound if not provided', async () => {
    const mockResult = {
      message: 'SUCCESS',
      result: [{ id: 111111111, success: true }]
    };

    mockAPI.sheets.deleteRows.mockResolvedValue(mockResult);

    const input = {
      sheetId: '123456789',
      rowIds: ['111111111']
    };

    const result = await tool.execute(input);

    // The default value for ignoreRowsNotFound is true in the API
    expect(mockAPI.sheets.deleteRows).toHaveBeenCalledWith(
      '123456789',
      ['111111111'],
      undefined
    );
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
    const mockErrorResult = {
      message: 'ERROR',
      result: [
        { id: 111111111, success: true },
        { id: 999999999, success: false, error: { code: 1006, message: 'Not Found' } }
      ]
    };

    mockAPI.sheets.deleteRows.mockResolvedValue(mockErrorResult);

    const input = {
      sheetId: '123456789',
      rowIds: ['111111111', '999999999'],
      ignoreRowsNotFound: false
    };

    const result = await tool.execute(input);

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockErrorResult, null, 2)
        }
      ]
    });
  });

  it('should validate schema correctly', () => {
    const schema = tool.schema;
    
    expect(schema.sheetId).toBeDefined();
    expect(schema.sheetId.description).toBe('The ID of the sheet to delete rows from');
    
    expect(schema.rowIds).toBeDefined();
    expect(schema.rowIds.description).toBe('Array of row IDs to delete');
    
    expect(schema.ignoreRowsNotFound).toBeDefined();
    expect(schema.ignoreRowsNotFound.description).toBe('Whether to ignore rows that don\'t exist');
  });
});