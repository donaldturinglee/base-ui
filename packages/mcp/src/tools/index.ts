import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Registry } from "../registry/registry.types";
import { registerGetComponent } from "./getComponent";
import { registerGetComponentExamples } from "./getComponentExamples";
import { registerGetSetupGuide } from "./getSetupGuide";
import { registerListComponents } from "./listComponents";
import { registerListTokens } from "./listTokens";

// The order the tools are registered in is the order a client is offered them in, so they are
// registered in the order they are worth reaching for: what is set up once, then what the
// library holds, then what one of them takes, then what it looks like written out
export const registerTools = (server: McpServer, registry: Registry): void => {
    registerGetSetupGuide(server, registry);
    registerListComponents(server, registry);
    registerGetComponent(server, registry);
    registerGetComponentExamples(server, registry);
    registerListTokens(server, registry);
};
