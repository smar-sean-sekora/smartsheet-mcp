import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SmartsheetAPI } from "../apis/smartsheet-api";

interface CreateSheetInput {
  name: string;
  columns: any[];
  folderId?: string;
}

class CreateSheetTool extends MCPTool<CreateSheetInput> {
  name = "create-sheet";
  description = "Create a new Smartsheet";

  schema = {
    name: {
      type: z.string(),
      description: "Name for the new sheet",
    },
    columns: {
      type: z.array(
        z.object({
          title: z.string().describe("Column title"),
          type: z.string().describe("Column type (TEXT_NUMBER, PICKLIST, etc.)"),
          primary: z.boolean().optional().describe("Whether this is the primary column"),
          options: z.array(z.string()).optional().describe("Options for PICKLIST columns"),
          width: z.number().optional().describe("Column width in pixels"),
          locked: z.boolean().optional().describe("Whether column is locked"),
          validation: z.boolean().optional().describe("Whether column has validation"),
        })
      ),
      description: "Array of column definitions for the sheet",
    },
    folderId: {
      type: z.string().optional(),
      description: "Optional folder ID where the sheet should be created",
    },
  };

  async execute(input: CreateSheetInput) {
    try {
      const api = new SmartsheetAPI(
        process.env.SMARTSHEET_API_KEY,
        process.env.SMARTSHEET_ENDPOINT
      );
      const result = await api.sheets.createSheet(input.name, input.columns, input.folderId);
      
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
            text: `Failed to create sheet: ${error}`
          }
        ]
      };
    }
  }
}

export default CreateSheetTool;