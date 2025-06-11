import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SmartsheetAPI } from "../apis/smartsheet-api";

interface GetSheetRowsInput { 
  sheetId: string;
  rowId: string;
  include: string;
}

class GetSheetRowsTool extends MCPTool<GetSheetRowsInput> {
  name = "get-sheet-rows";
  description = "GetSheetRows tool description";

  schema = {
      sheetId: {
      type: z.string(),
      description: "The ID of the sheet to retrieve",
    },
    rowId: {
      type: z.string(),
      description: "The ID of the row to retrieve",
    },
    include: {
      type: z.string(),
      description: "Optional comma-separated list of elements to include",
    },
  };

  async execute(input: GetSheetRowsInput) {
    try {
      const api = new SmartsheetAPI(
        process.env.SMARTSHEET_API_KEY,
        process.env.SMARTSHEET_ENDPOINT
      );
      const row = await api.sheets.getRow(input.sheetId, input.rowId, input.include);
            
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(row, null, 2)
          }
        ]
      };
    } catch (error) {
      return `Failed to get row: ${error}`;
    }
  }
}

export default GetSheetRowsTool;