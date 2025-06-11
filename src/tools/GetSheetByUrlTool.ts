import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SmartsheetAPI } from "../apis/smartsheet-api";

interface GetSheetByUrlInput {
  url: string;
}

class GetSheetByUrlTool extends MCPTool<GetSheetByUrlInput> {
  name = "get-sheet-by-url";
  description =
    "Retrieves the current state of a sheet, including rows, columns, and cells";

  schema = {
    url: {
      type: z.string(),
      description: "The URL of the sheet to retrieve",
    },
  };

  async execute(input: GetSheetByUrlInput) {
    try {
      const api = new SmartsheetAPI(
        process.env.SMARTSHEET_API_KEY,
        process.env.SMARTSHEET_ENDPOINT
      );
      const match = input.url.match(/\/sheets\/([^?\/]+)/);
      const directIdToken = match ? match[1] : null;
      if (!directIdToken) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to get sheet: Invalid URL format`,
            },
          ],
          isError: true,
        };
      }
      const sheet = await api.sheets.getSheetByDirectIdToken(
        directIdToken,
        undefined,
        undefined,
        undefined,
        undefined
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(sheet, null, 2),
          },
        ],
      };
    } catch (error) {
      return `Failed to get sheet: ${error}`;
    }
  }
}

export default GetSheetByUrlTool;
