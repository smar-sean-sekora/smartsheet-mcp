import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SmartsheetAPI } from "../apis/smartsheet-api";

interface AddSheetRowsInput {
  sheetId: string;
  rows: any[];
}

class AddSheetRowsTool extends MCPTool<AddSheetRowsInput> {
  name = "add-sheet-rows";
  description = "Add new rows to a Smartsheet";

  schema = {
    sheetId: {
      type: z.string(),
      description: "The ID of the sheet to add rows to",
    },
    rows: {
      type: z.array(
        z.object({
          cells: z.array(
            z.object({
              columnId: z.number().or(z.string()).describe("Column ID"),
              value: z.any().optional().describe("Cell value"),
              formula: z.string().optional().describe("Cell formula"),
              format: z.string().optional().describe("Cell format"),
            })
          ).describe("Array of cells for this row"),
          toTop: z.boolean().optional().describe("Add row to top of sheet"),
          toBottom: z.boolean().optional().describe("Add row to bottom of sheet"),
          parentId: z.number().optional().describe("Parent row ID for hierarchical sheets"),
          siblingId: z.number().optional().describe("Sibling row ID for positioning"),
        })
      ),
      description: "Array of row objects to add",
    },
  };

  async execute(input: AddSheetRowsInput) {
    try {
      const api = new SmartsheetAPI(
        process.env.SMARTSHEET_API_KEY,
        process.env.SMARTSHEET_ENDPOINT
      );
      const result = await api.sheets.addRows(input.sheetId, input.rows);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to add rows: ${error}`
          }
        ]
      };
    }
  }
}

export default AddSheetRowsTool;