import { Code, CodeBlock, Heading, Stack, Text } from "@gamecrafters/base-ui/react";

const classes = {
    // The prose is read, the listings beside it are copied, so only the prose is held to a measure
    prose: "max-w-[46rem]",
    // A listing is copied rather than read across, so it is held to a narrower measure than the
    // prose and its lines are left at the length they were written at
    listing: "max-w-[46rem]",
};

// What every client is told to run, whichever of them it is. The package is fetched and started
// in the one step rather than installed first, since nothing on the machine reaches for it but the
// client that starts it
const command = `npx -y @gamecrafters/base-ui-mcp`;

// The same command as most clients ask for it: the server named, and under the name what it is
// started with. It is what a client is handed unless it says otherwise
const client = `{
  "mcpServers": {
    "base-ui": {
      "command": "npx",
      "args": ["-y", "@gamecrafters/base-ui-mcp"]
    }
  }
}`;

// The same server as Visual Studio Code asks for it. It heads the file with `servers` rather than
// `mcpServers`, and asks to be told the transport rather than working it out from what it was
// given, so those two are what a file brought over from another client is short of
const vsCode = `{
  "servers": {
    "base-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@gamecrafters/base-ui-mcp"]
    }
  }
}`;

// Claude Code is told at the command line and writes the file itself, so there is none to write
// by hand. What follows the `--` is the server as it is started
const claudeCode = `claude mcp add base-ui --scope project -- npx -y @gamecrafters/base-ui-mcp`;

// What the server is for and how it is reached, in the order it is done in: what every client is
// told, and then where each of them is told it. What it answers once it is running is asked of it
// by the client rather than written up here
const MCPServer = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                MCP Server
            </Heading>
            <Text as="p" size="large">
                A Model Context Protocol server that lets a coding agent ask the design system what
                it holds rather than guess at it. Everything it answers is read out of the
                library&rsquo;s own sources at the end of a build, so it says what the components
                were written as rather than what was once written about them.
            </Text>
        </Stack>
        <Stack gap="condensed" className={classes.listing}>
            <Heading as="h2" size="small">
                Setup
            </Heading>
            <Text as="p" size="small" className={classes.prose}>
                The server is a package of its own, published beside the library. A client starts it
                as a program and speaks to it over the streams it was started with rather than over
                a port, so there is nothing to run first and no port to keep free. Every client
                below is told the same command, and only where it is written down differs.
            </Text>
            <CodeBlock language="shellscript">
                <CodeBlock.Content>
                    <CodeBlock.Code>{command}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
        </Stack>
        <Stack gap="condensed" className={classes.listing}>
            <Heading as="h2" size="small">
                Visual Studio Code
            </Heading>
            <Text as="p" size="small" className={classes.prose}>
                Written in <Code>.vscode/mcp.json</Code> for the one project, or in the user profile
                for every project at once. It is the one client here that heads the file with{" "}
                <Code>servers</Code> rather than <Code>mcpServers</Code> and asks to be told the
                transport, so those two are what a file brought over from another client is short
                of.
            </Text>
            <CodeBlock language="json">
                <CodeBlock.Header>
                    <CodeBlock.Title>.vscode/mcp.json</CodeBlock.Title>
                </CodeBlock.Header>
                <CodeBlock.Content>
                    <CodeBlock.Code>{vsCode}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
        </Stack>
        <Stack gap="condensed" className={classes.listing}>
            <Heading as="h2" size="small">
                Cursor
            </Heading>
            <Text as="p" size="small" className={classes.prose}>
                Written in <Code>.cursor/mcp.json</Code> at the root of the project, or in{" "}
                <Code>~/.cursor/mcp.json</Code> for every project at once. Where a server is named
                in both, the one written for the project is the one that stands.
            </Text>
            <CodeBlock language="json">
                <CodeBlock.Header>
                    <CodeBlock.Title>.cursor/mcp.json</CodeBlock.Title>
                </CodeBlock.Header>
                <CodeBlock.Content>
                    <CodeBlock.Code>{client}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
        </Stack>
        <Stack gap="condensed" className={classes.listing}>
            <Heading as="h2" size="small">
                Claude Code
            </Heading>
            <Text as="p" size="small" className={classes.prose}>
                Told at the command line rather than in a file written by hand.{" "}
                <Code>--scope project</Code> writes it to a <Code>.mcp.json</Code> the repository
                carries, so that everyone who clones it is offered the same server; left out, it is
                kept to the one machine.
            </Text>
            <CodeBlock language="shellscript">
                <CodeBlock.Content>
                    <CodeBlock.Code>{claudeCode}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
        </Stack>
        <Stack gap="condensed" className={classes.listing}>
            <Heading as="h2" size="small">
                Custom MCP Client
            </Heading>
            <Text as="p" size="small" className={classes.prose}>
                Anything that speaks the protocol over the streams it started a program with can
                reach the server. The shape below is the one most clients read; a client that reads
                another is told the same command and the same arguments under whatever it calls
                them.
            </Text>
            <CodeBlock language="json">
                <CodeBlock.Content>
                    <CodeBlock.Code>{client}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
        </Stack>
    </Stack>
);

export default MCPServer;
