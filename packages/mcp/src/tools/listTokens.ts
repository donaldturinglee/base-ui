import { z } from "zod";
import { searchTokens } from "../registry";
import type { Registry, RegistryToken } from "../registry/registry.types";
import { count, reply } from "./format";
import type { RegisterTool } from "./tools.types";

const DESCRIPTION =
    "The design tokens the Base UI components are drawn from, as the CSS custom properties " +
    "an application names them by. A token that belongs to a colour scheme is answered by a " +
    "value under each of them. Reach for these rather than a literal colour or measurement " +
    "whenever something is being styled beside the library, so that it follows the scheme " +
    "the rest of the page is already in.";

const QUERY = "Narrows the tokens to the ones this appears in the name, group or description of.";

const GROUP = "Narrows the tokens to one group, which is how they are headed in the answer.";

// The whole set runs to hundreds, which is more than is worth reading at once, so a search that
// was not narrowed is cut short and says by how much
const LIMIT = 60;

export const registerListTokens: RegisterTool = (server, registry) => {
    server.registerTool(
        "list_tokens",
        {
            title: "List Base UI design tokens",
            description: DESCRIPTION,
            inputSchema: {
                query: z.string().optional().describe(QUERY),
                group: z.string().optional().describe(GROUP),
            },
        },
        ({ query, group }) => reply(list(registry, query, group)),
    );
};

const list = (registry: Registry, query?: string, group?: string): string => {
    const tokens = searchTokens(registry, query, group);

    if (tokens.length === 0) {
        return `No design token answers to that. The groups are: ${groups(registry).join(", ")}.`;
    }

    const shown = tokens.slice(0, LIMIT);
    const left = tokens.length - shown.length;
    const found =
        left > 0
            ? `${count(tokens.length, "token")}, of which the first ${shown.length} are below.`
            : `${count(tokens.length, "token")}.`;

    return [
        "# Design tokens",
        found,
        ...headings(shown),
        ...(left > 0 ? [remainder(left, registry, group)] : []),
    ].join("\n\n");
};

// Tokens are read a group at a time, since a group is a scale and a scale is only worth
// anything read against the rest of itself
const headings = (tokens: RegistryToken[]): string[] => {
    const groups = [...new Set(tokens.map((token) => token.group))];

    return groups.map((group) => {
        const held = tokens.filter((token) => token.group === group);
        return [`## ${group}`, ...held.map(describe)].join("\n");
    });
};

const describe = (token: RegistryToken): string => {
    const said = [`- \`${token.name}\` — ${values(token)}`];
    if (token.description) {
        said.push(`. ${token.description}`);
    }
    return said.join("");
};

// A primitive holds the one value however the page is themed, and everything else is worth
// reading a scheme at a time
const values = (token: RegistryToken): string => {
    if (token.values.static !== undefined) {
        return `\`${token.values.static}\``;
    }
    return Object.entries(token.values)
        .map(([scheme, value]) => `${scheme} \`${value}\``)
        .join(", ");
};

const groups = (registry: Registry): string[] => {
    return [...new Set(registry.tokens.map((token) => token.group))].sort();
};

const remainder = (left: number, registry: Registry, group?: string): string => {
    const narrow = group
        ? "Narrow it with a query."
        : `Narrow it with a query, or with one of these groups: ${groups(registry).join(", ")}.`;
    return `${count(left, "token")} beyond that ${left === 1 ? "was" : "were"} left out. ${narrow}`;
};
