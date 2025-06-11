import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SmartsheetAPI } from "../apis/smartsheet-api";

interface GetSheetByIdInput {
  sheetId: string;
  include: string;
  pageSize: number;
  page: number;
}

class GetSheetByIdTool extends MCPTool<GetSheetByIdInput> {
  name = "get-sheet-by-id";
  description = "GetSheetById tool description";

  schema = {
    sheetId: {
      type: z.string(),
      description: "The ID of the sheet to retrieve",
    },
    include: {
      type: z.string(),
      description: "Optional comma-separated list of elements to include",
    },
    pageSize: {
      type: z.number(),
      description: "Optional page size",
    },
    page: {
      type: z.number(),
      description: "Optional page number",
    },
  };

  async execute(input: GetSheetByIdInput) {
    try {
      const api = new SmartsheetAPI(
        process.env.SMARTSHEET_API_KEY,
        process.env.SMARTSHEET_ENDPOINT
      );
      const sheet = await api.sheets.getSheet(input.sheetId, input.include, undefined, input.pageSize, input.page);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(sheet, null, 2)
              }
            ]
          };

    } catch (error) {
      return `Failed to get sheet: ${error}`;
    }
  }
}

export default GetSheetByIdTool;