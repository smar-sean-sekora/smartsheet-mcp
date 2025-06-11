import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SmartsheetAPI } from "../apis/smartsheet-api";

interface DeleteRowsInput {
  sheetId: string;
  rowIds: string[];
  ignoreRowsNotFound?: boolean;
}

class DeleteRowsTool extends MCPTool<DeleteRowsInput> {
  name = "delete-rows";
  description = "Deletes rows from a sheet";

  schema = {
    sheetId: {
      type: z.string(),
      description: "The ID of the sheet to delete rows from",
    },
    rowIds: {
      type: z.array(z.string()),
      description: "Array of row IDs to delete",
    },
    ignoreRowsNotFound: {
      type: z.boolean().optional(),
      description: "Whether to ignore rows that don't exist",
    },
  };

  async execute(input: DeleteRowsInput) {
    const api = new SmartsheetAPI(
      process.env.SMARTSHEET_API_KEY,
      process.env.SMARTSHEET_ENDPOINT
    );
    const result = await api.sheets.deleteRows(
      input.sheetId, 
      input.rowIds, 
      input.ignoreRowsNotFound
    );
            
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    }; 
  }
}

export default DeleteRowsTool;
