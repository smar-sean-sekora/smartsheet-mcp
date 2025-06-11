import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SmartsheetAPI } from "../apis/smartsheet-api";

interface UpdateSheetRowsInput {
  sheetId: string;
  rows: any[];
}

class UpdateSheetRowsTool extends MCPTool<UpdateSheetRowsInput> {
  name = "update-sheet-rows";
  description = "UpdateSheetRows tool description";

  schema = {
    sheetId: {
      type: z.string(),
      description: "The ID of the sheet to update",
    },
    rows: {
      type: z.array(
        z.object({
          columnId: z.number().or(z.string()).describe("Column ID"),
          value: z.any().optional().describe("Cell value"),
          formula: z.string().optional().describe("Cell formula"),
          format: z.string().optional().describe("Cell format"),
        })
      ),
      description: "Array of row objects to update",
    },
  };

  async execute(input: UpdateSheetRowsInput) {
    const api = new SmartsheetAPI(
      process.env.SMARTSHEET_API_KEY,
      process.env.SMARTSHEET_ENDPOINT
    );
    const result = await api.sheets.updateRows(input.sheetId, input.rows);
            
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };  }
}

export default UpdateSheetRowsTool;