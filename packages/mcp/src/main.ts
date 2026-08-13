import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server";

// The server is spoken to over the streams it was started with rather than over a port, which
// is how a client that starts it as a program of its own reaches it. Nothing is written to
// stdout that is not the protocol itself, since stdout is the protocol

await createServer().connect(new StdioServerTransport());
