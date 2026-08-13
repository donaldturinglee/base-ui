import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readRegistry } from "./registry";
import type { Registry } from "./registry/registry.types";
import { registerTools } from "./tools";

// The server is the design system with a protocol in front of it. It holds no state of its own
// and reaches for nothing while it is running: the registry is read once as it is built, and
// every question after that is answered out of what is already in hand

// The name a client lists the server under, which is the design system rather than the package
// the server happens to be published as
const NAME = "base-ui";

export const createServer = (registry: Registry = readRegistry()): McpServer => {
    const server = new McpServer(
        { name: NAME, version: registry.version },
        {
            instructions:
                "Base UI is a React design system. Ask list_components for what it holds " +
                "before building anything it may already have, get_component for what one " +
                "of them takes, and get_setup_guide before the first of them is written " +
                "into a codebase.",
        },
    );

    registerTools(server, registry);

    return server;
};
