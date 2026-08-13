import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Registry } from "../registry/registry.types";

// A tool is registered against the server rather than handed back to it, so that what it is
// called, what it is described by and what it answers with all stay in the one file
export type RegisterTool = (server: McpServer, registry: Registry) => void;
