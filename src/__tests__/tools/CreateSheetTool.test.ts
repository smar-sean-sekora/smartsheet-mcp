import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CreateSheetTool from '../../tools/CreateSheetTool.js';
import { SmartsheetAPI } from '../../apis/smartsheet-api.js';
import { mockEnvironmentVariables, restoreEnvironmentVariables } from '../test-utils.js';

// Mock the SmartsheetAPI
vi.mock('../../apis/smartsheet-api.js', () => ({
  SmartsheetAPI: vi.fn().mockImplementation(() => ({
    sheets: {
      createSheet: vi.fn()
    }
  }))
}));

describe('CreateSheetTool', () => {
  let tool: CreateSheetTool;
  let mockAPI: any;

  beforeEach(() => {
    mockEnvironmentVariables();
    tool = new CreateSheetTool();
    mockAPI = {
      sheets: {
        createSheet: vi.fn()
      }
    };
    (SmartsheetAPI as any).mockImplementation(() => mockAPI);
  });

  afterEach(() => {
    restoreEnvironmentVariables();
    vi.clearAllMocks();
  });

  it('should have correct name and description', () => {
    expect(tool.name).toBe('create-sheet');
    expect(tool.description).toBe('Create a new Smartsheet');
  });

  it('should create sheet successfully', async () => {
    const mockResult = {
      result: {
        id: 123456789,
        name: 'Test Sheet',
        columns: [
          { id: 1, title: 'Task', type: 'TEXT_NUMBER', primary: true },
          { id: 2, title: 'Status', type: 'PICKLIST' }
        ]
      }
    };

    mockAPI.sheets.createSheet.mockResolvedValue(mockResult);

    const input = {
      name: 'Test Sheet',
      columns: [
        { title: 'Task', type: 'TEXT_NUMBER', primary: true },
        { title: 'Status', type: 'PICKLIST', options: ['Not Started', 'In Progress', 'Complete'] }
      ]
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.createSheet).toHaveBeenCalledWith(
      'Test Sheet',
      input.columns,
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

  it('should create sheet in specific folder', async () => {
    const mockResult = {
      result: {
        id: 123456789,
        name: 'Test Sheet',
        parentId: 987654321
      }
    };

    mockAPI.sheets.createSheet.mockResolvedValue(mockResult);

    const input = {
      name: 'Test Sheet',
      columns: [
        { title: 'Task', type: 'TEXT_NUMBER', primary: true }
      ],
      folderId: '987654321'
    };

    const result = await tool.execute(input);

    expect(mockAPI.sheets.createSheet).toHaveBeenCalledWith(
      'Test Sheet',
      input.columns,
      '987654321'
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
    const mockError = new Error('API Error: Invalid column type');
    mockAPI.sheets.createSheet.mockRejectedValue(mockError);

    const input = {
      name: 'Test Sheet',
      columns: [
        { title: 'Task', type: 'INVALID_TYPE' }
      ]
    };

    const result = await tool.execute(input);

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'Failed to create sheet: Error: API Error: Invalid column type'
        }
      ]
    });
  });

  it('should validate schema correctly', () => {
    const schema = tool.schema;
    
    expect(schema.name).toBeDefined();
    expect(schema.name.description).toBe('Name for the new sheet');
    
    expect(schema.columns).toBeDefined();
    expect(schema.columns.description).toBe('Array of column definitions for the sheet');
    
    expect(schema.folderId).toBeDefined();
    expect(schema.folderId.description).toBe('Optional folder ID where the sheet should be created');
  });
});