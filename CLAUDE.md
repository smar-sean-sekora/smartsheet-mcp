# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

- `npm install` - Install dependencies
- `npm run build` - Compile TypeScript and build MCP server (uses `tsc && mcp-build`)
- `npm run watch` - Watch TypeScript files for changes
- `npm start` - Build and start the MCP server locally

## Architecture Overview

This is a Model Context Protocol (MCP) server that provides Smartsheet API integration through the mcp-framework. The codebase follows a layered architecture:

### Core Structure
- **Entry Point**: `src/index.ts` - Simple MCP server initialization
- **API Layer**: `src/apis/` - Contains Smartsheet API client classes organized by resource type
- **Tools Layer**: `src/tools/` - MCP tools that expose Smartsheet functionality to Claude

### API Architecture
The `SmartsheetAPI` class (`src/apis/smartsheet-api.ts`) serves as the main client with:
- Built-in retry logic for rate limiting (429 responses)
- Environment variable configuration for `SMARTSHEET_API_KEY` and `SMARTSHEET_ENDPOINT`
- Modular sub-APIs for different Smartsheet resources (sheets, workspaces, folders, users, search, discussions)

### Tool Development Pattern
All tools extend `MCPTool<T>` and follow this structure:
- Define input interface with typed parameters
- Use Zod schemas for validation
- Instantiate `SmartsheetAPI` with environment variables
- Return responses in MCP content format: `{ content: [{ type: "text", text: "..." }] }`

### Environment Requirements
The SmartsheetAPI constructor expects these environment variables:
- `SMARTSHEET_API_KEY` - API access token
- `SMARTSHEET_ENDPOINT` - Smartsheet API base URL

Both are required and will throw errors if missing.

### Framework Integration
The project uses mcp-framework for MCP server functionality and automatic tool discovery. The build process includes both TypeScript compilation and `mcp-build` for proper MCP packaging.