import { z } from "zod";
import { findEntry } from "../registry";
import type {
    Registry,
    RegistryEntry,
    RegistryProp,
    RegistryProps,
} from "../registry/registry.types";
import { count, fence, importLine, join, reply, signature } from "./format";
import type { RegisterTool } from "./tools.types";

const DESCRIPTION =
    "Everything one Base UI component or provider takes: the line it is imported by, the " +
    "parts hung off it, the types it is written against, and every prop with what it is for " +
    "and the values it takes. Ask for this before writing the component into anything, " +
    "rather than guessing a prop that reads as though it ought to exist.";

const NAME =
    "The component, provider or part. Any of the names it is known by will do: Dialog, " +
    "dialog, DialogHeader or Dialog.Header all reach the one entry.";

export const registerGetComponent: RegisterTool = (server, registry) => {
    server.registerTool(
        "get_component",
        {
            title: "Get a Base UI component",
            description: DESCRIPTION,
            inputSchema: {
                name: z.string().describe(NAME),
            },
        },
        ({ name }) => reply(describe(registry, name)),
    );
};

const describe = (registry: Registry, name: string): string => {
    const entry = findEntry(registry, name);

    if (!entry) {
        return (
            `${registry.package} has nothing called "${name}". ` +
            "Ask list_components for what it does have."
        );
    }

    return [
        `# ${entry.name}`,
        fence("tsx", importLine(registry, [entry.name])),
        facts(entry),
        ...entry.props.map(group),
    ]
        .filter((part) => part !== "")
        .join("\n\n");
};

// What is true of the entry as a whole rather than of any one prop of it
const facts = (entry: RegistryEntry): string => {
    const said: string[] = [];
    const others = entry.exports.slice(1);

    if (entry.parts.length > 0) {
        const parts = entry.parts.map((part) => `\`${entry.name}.${part}\``);
        said.push(`- Parts, reached through the component itself: ${parts.join(", ")}`);
    }
    if (others.length > 0) {
        said.push(`- Exported beside it: ${others.map((one) => `\`${one}\``).join(", ")}`);
    }
    if (entry.types.length > 0) {
        said.push(`- Types: ${entry.types.map((one) => `\`${one}\``).join(", ")}`);
    }
    if (entry.examples.length > 0) {
        said.push(
            `- ${count(entry.examples.length, "worked example")}, which ` +
                "get_component_examples has.",
        );
    }

    return said.join("\n");
};

const group = (props: RegistryProps): string => {
    const said = [`## ${props.name}`];

    if (props.inherits.length > 0) {
        const inherited = props.inherits.map((one) => `\`${one}\``);
        said.push(`Everything ${join(inherited)} takes, and:`);
    }

    said.push(
        props.props.length === 0 ? "Nothing of its own." : props.props.map(describeProp).join("\n"),
    );

    return said.join("\n\n");
};

const describeProp = (prop: RegistryProp): string => {
    const written = `- \`${signature(prop)}\``;
    const said = prop.description ? `${written} — ${prop.description}` : written;

    if (!prop.options) {
        return said;
    }

    return `${said}\n  - One of: ${prop.options.map((one) => `\`${one}\``).join(", ")}`;
};
