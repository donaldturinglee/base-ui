import { z } from "zod";
import { searchEntries } from "../registry";
import type { Registry, RegistryEntry } from "../registry/registry.types";
import { count, reply } from "./format";
import type { RegisterTool } from "./tools.types";

const DESCRIPTION =
    "Lists every component and provider the Base UI design system exports, with the parts " +
    "each one carries and how much is known about it. Read this before writing any markup " +
    "against the library, so that a component that already exists is used rather than built " +
    "again, and then ask get_component for what the one you settle on takes.";

const QUERY =
    "Narrows the list to what this appears in the name, props, parts or examples of. Leave " +
    "it out for the whole library.";

// What is worth saying about the library once rather than about each entry in turn
const PREAMBLE =
    "Everything below is imported by name from the package root. The stylesheet is imported " +
    "once at the root of the application and a ThemeProvider is wrapped around it, both of " +
    "which get_setup_guide says how to do.";

export const registerListComponents: RegisterTool = (server, registry) => {
    server.registerTool(
        "list_components",
        {
            title: "List Base UI components",
            description: DESCRIPTION,
            inputSchema: {
                query: z.string().optional().describe(QUERY),
            },
        },
        ({ query }) => reply(list(registry, query)),
    );
};

const list = (registry: Registry, query?: string): string => {
    const entries = searchEntries(registry, query);

    if (entries.length === 0) {
        return `Nothing in ${registry.package} answers to "${query ?? ""}".`;
    }

    const sections = [
        section("Components", entries.filter(inSection("components"))),
        section("Providers", entries.filter(inSection("providers"))),
    ];

    return [
        `# ${registry.package} ${registry.version}`,
        query ? `${count(entries.length, "entry", "entries")} answer to "${query}".` : PREAMBLE,
        ...sections.filter((one) => one !== ""),
    ].join("\n\n");
};

const inSection = (section: RegistryEntry["section"]) => {
    return (entry: RegistryEntry) => entry.section === section;
};

const section = (title: string, entries: RegistryEntry[]): string => {
    if (entries.length === 0) {
        return "";
    }
    return [`## ${title}`, ...entries.map(summarize)].join("\n");
};

// What the entry itself takes rather than what everything under it takes between them, since
// the props of a part are the part's and are read off it once it is asked about by name
const summarize = (entry: RegistryEntry): string => {
    const props = entry.props[0]?.props.length ?? 0;
    const said = [count(props, "prop"), count(entry.examples.length, "example")];

    if (entry.parts.length > 0) {
        const parts = entry.parts.map((part) => `${entry.name}.${part}`);
        said.push(`parts ${parts.join(", ")}`);
    }

    return `- **${entry.name}** — ${said.join(", ")}`;
};
