import { z } from "zod";
import { findEntry } from "../registry";
import type { Registry, RegistryExample } from "../registry/registry.types";
import { count, fence, reply } from "./format";
import type { RegisterTool } from "./tools.types";

const DESCRIPTION =
    "The worked examples of one Base UI component, read out of the stories it is developed " +
    "and reviewed in. Each one is the code as an application would write it, with whatever " +
    "it reaches for beside itself brought along. Ask for these when the shape of a component " +
    "matters as much as its props: what its parts are nested in, what a controlled one is " +
    "driven by, what a slot is filled with.";

const NAME =
    "The component or provider. Any of the names it is known by will do: Dialog, dialog, " +
    "DialogHeader or Dialog.Header all reach the one entry.";

const TITLE =
    "Narrows the examples to the ones this appears in the title of, which is worth doing " +
    "where a component has more of them than are wanted at once.";

// A component with a great many examples would otherwise answer with more than is worth
// reading in one go, so what is left out is named rather than quietly dropped
const BUDGET = 20000;

export const registerGetComponentExamples: RegisterTool = (server, registry) => {
    server.registerTool(
        "get_component_examples",
        {
            title: "Get Base UI component examples",
            description: DESCRIPTION,
            inputSchema: {
                name: z.string().describe(NAME),
                title: z.string().optional().describe(TITLE),
            },
        },
        ({ name, title }) => reply(show(registry, name, title)),
    );
};

const show = (registry: Registry, name: string, title?: string): string => {
    const entry = findEntry(registry, name);

    if (!entry) {
        return (
            `${registry.package} has nothing called "${name}". ` +
            "Ask list_components for what it does have."
        );
    }

    const examples = matching(entry.examples, title);

    if (examples.length === 0) {
        const known = entry.examples.map((example) => example.title);
        return title && known.length > 0
            ? `No ${entry.name} example is titled "${title}". There are: ${known.join(", ")}.`
            : `${entry.name} has no examples beside it.`;
    }

    const shown = within(examples, BUDGET);
    const left = examples.slice(shown.length);

    return [
        `# ${entry.name}`,
        ...shown.flatMap((example) => [`## ${example.title}`, fence("tsx", example.source)]),
        ...(left.length === 0 ? [] : [remainder(left)]),
    ].join("\n\n");
};

const matching = (examples: RegistryExample[], title?: string): RegistryExample[] => {
    const wanted = title?.trim().toLowerCase();
    if (!wanted) {
        return examples;
    }
    return examples.filter((example) => example.title.toLowerCase().includes(wanted));
};

// As many as fit, and always at least one however long that one turns out to be
const within = (examples: RegistryExample[], budget: number): RegistryExample[] => {
    const kept: RegistryExample[] = [];
    let spent = 0;

    for (const example of examples) {
        if (kept.length > 0 && spent + example.source.length > budget) {
            break;
        }
        kept.push(example);
        spent += example.source.length;
    }

    return kept;
};

const remainder = (left: RegistryExample[]): string => {
    const titles = left.map((example) => example.title).join(", ");
    const said = left.length === 1 ? "was" : "were";
    return (
        `${count(left.length, "further example")} ${said} left out to keep this to a ` +
        `readable length: ${titles}. Ask for one of them by title.`
    );
};
