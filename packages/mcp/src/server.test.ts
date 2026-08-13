import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { beforeAll, describe, expect, it } from "vitest";
import { createServer } from "./server";
import { registry } from "./tests/registry";

// The server is held to what a client actually gets back, so the suite is a client: the two are
// connected to each other over a pair of streams that go nowhere else, and every question is
// asked the way one would be asked in earnest

let client: Client;

beforeAll(async () => {
    const [clientEnd, serverEnd] = InMemoryTransport.createLinkedPair();
    client = new Client({ name: "suite", version: "0.0.0" });
    await Promise.all([createServer(registry).connect(serverEnd), client.connect(clientEnd)]);
});

const call = async (name: string, args: Record<string, unknown> = {}) => {
    const result = await client.callTool({ name, arguments: args });
    const content = result.content as { type: string; text: string }[];
    return content.map((one) => one.text).join("\n");
};

describe("the server", () => {
    it("offers a tool for each thing the design system is asked about", async () => {
        const { tools } = await client.listTools();
        expect(tools.map((tool) => tool.name)).toEqual([
            "get_setup_guide",
            "list_components",
            "get_component",
            "get_component_examples",
            "list_tokens",
        ]);
    });

    it("describes every tool it offers", async () => {
        const { tools } = await client.listTools();
        for (const tool of tools) {
            expect(tool.description?.length ?? 0).toBeGreaterThan(0);
        }
    });
});

describe("get_setup_guide", () => {
    it("names the package, the stylesheet and the provider the tokens resolve under", async () => {
        const said = await call("get_setup_guide");
        expect(said).toContain("npm install @gamecrafters/base-ui");
        expect(said).toContain('import "@gamecrafters/base-ui/main.css";');
        expect(said).toContain("ThemeProvider");
    });
});

describe("list_components", () => {
    it("lists what the library holds, a section at a time", async () => {
        const said = await call("list_components");
        expect(said).toContain("## Components");
        expect(said).toContain("**Button**");
        expect(said).toContain("## Providers");
        expect(said).toContain("**ThemeProvider**");
    });

    it("says what is hung off a component that has parts", async () => {
        expect(await call("list_components")).toContain("Dialog.Header");
    });

    it("narrows to what was asked for", async () => {
        const said = await call("list_components", { query: "theme" });
        expect(said).toContain("**ThemeProvider**");
        expect(said).not.toContain("**Button**");
    });

    it("says as much when nothing answers", async () => {
        expect(await call("list_components", { query: "nothing of the sort" })).toContain(
            "Nothing in @gamecrafters/base-ui",
        );
    });
});

describe("get_component", () => {
    it("gives the line the component is imported by", async () => {
        expect(await call("get_component", { name: "Button" })).toContain(
            'import { Button } from "@gamecrafters/base-ui";',
        );
    });

    it("says what the component takes, and what it takes it on top of", async () => {
        const said = await call("get_component", { name: "Button" });
        expect(said).toContain("## ButtonProps");
        expect(said).toContain("`variant?: ButtonVariant`");
        expect(said).toContain("How much weight the button carries against the page");
        expect(said).toContain('ComponentPropsWithRef<"button">');
    });

    it("says which values a prop takes where its type names them", async () => {
        expect(await call("get_component", { name: "Button" })).toContain("One of:");
    });

    it("marks a prop that has to be passed", async () => {
        expect(await call("get_component", { name: "Dialog" })).toContain("`onClose: () => void`");
    });

    it("answers a part with the component it hangs off", async () => {
        expect(await call("get_component", { name: "Dialog.Header" })).toContain("# Dialog");
    });

    it("says as much for a name the library does not have", async () => {
        expect(await call("get_component", { name: "Carousel" })).toContain(
            'has nothing called "Carousel"',
        );
    });
});

describe("get_component_examples", () => {
    it("gives each example as the code an application would write", async () => {
        const said = await call("get_component_examples", { name: "Button" });
        expect(said).toContain("## Variant Scale");
        expect(said).toContain("```tsx");
        expect(said).toContain("const VariantScale = () => <Button />;");
    });

    it("narrows to an example by its title", async () => {
        const said = await call("get_component_examples", { name: "Button", title: "loading" });
        expect(said).toContain("## Loading");
        expect(said).not.toContain("## Variant Scale");
    });

    it("says which examples there are where the title answers to none of them", async () => {
        expect(
            await call("get_component_examples", { name: "Button", title: "nothing" }),
        ).toContain("There are: Variant Scale, Loading.");
    });

    it("says as much for a component that has no examples beside it", async () => {
        expect(await call("get_component_examples", { name: "Dialog" })).toContain(
            "Dialog has no examples beside it.",
        );
    });
});

describe("list_tokens", () => {
    it("answers a token with the value it holds under each scheme", async () => {
        const said = await call("list_tokens", { query: "foreground" });
        expect(said).toContain("`--foreground-color-default`");
        expect(said).toContain("light `#1f2328`, dark `#e6edf3`");
        expect(said).toContain("The colour body text is set in");
    });

    it("answers a token that holds the one value however it is themed", async () => {
        expect(await call("list_tokens", { query: "base-size" })).toContain(
            "- `--base-size-4` — `0.25rem`",
        );
    });

    it("heads the tokens with the group they are read as part of", async () => {
        expect(await call("list_tokens", { group: "Base size scale" })).toContain(
            "## Base size scale",
        );
    });

    it("names the groups where nothing answers", async () => {
        expect(await call("list_tokens", { query: "nothing of the sort" })).toContain(
            "The groups are:",
        );
    });
});
