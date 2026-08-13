import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Registry, RegistryEntry, RegistryToken } from "./registry.types";

// The registry is written beside the bundle that reads it rather than carried inside it, and is
// found against this module rather than against wherever the server happened to be started from
const REGISTRY = fileURLToPath(new URL("./registry.json", import.meta.url));

export const readRegistry = (file: string = REGISTRY): Registry => {
    return JSON.parse(readFileSync(file, "utf8")) as Registry;
};

// An entry is asked for by whatever the caller has in front of it, which is the name it is
// drawn under rather than the directory it is written in: `Dialog`, `dialog`, `DialogHeader`
// and `Dialog.Header` are all the one entry
export const findEntry = (registry: Registry, name: string): RegistryEntry | undefined => {
    const wanted = name.trim().toLowerCase();

    return registry.entries.find((entry) => {
        return (
            entry.name.toLowerCase() === wanted ||
            entry.directory === wanted ||
            entry.exports.some((exported) => exported.toLowerCase() === wanted) ||
            entry.parts.some((part) => `${entry.name}.${part}`.toLowerCase() === wanted)
        );
    });
};

// Everything the query is answered by, in the order it answers it: what is named for the query
// first, and then what only mentions it somewhere further in
export const searchEntries = (registry: Registry, query?: string): RegistryEntry[] => {
    const wanted = query?.trim().toLowerCase();
    if (!wanted) {
        return registry.entries;
    }

    const named = (entry: RegistryEntry) => entry.name.toLowerCase().includes(wanted);

    return [
        ...registry.entries.filter((entry) => named(entry)),
        ...registry.entries.filter((entry) => !named(entry) && mentions(entry, wanted)),
    ];
};

// What an entry is worth searching by: what it is called, what it is imported and reached for
// as, what it takes, and what it has been shown doing
const mentions = (entry: RegistryEntry, wanted: string): boolean => {
    const said = [
        entry.directory,
        ...entry.exports,
        ...entry.parts,
        ...entry.types,
        ...entry.props.flatMap((group) => group.props.map((prop) => prop.name)),
        ...entry.examples.map((example) => example.title),
    ];

    return said.some((one) => one.toLowerCase().includes(wanted));
};

export const searchTokens = (
    registry: Registry,
    query?: string,
    group?: string,
): RegistryToken[] => {
    const wanted = query?.trim().toLowerCase();
    const wantedGroup = group?.trim().toLowerCase();

    return registry.tokens.filter((token) => {
        if (wantedGroup && token.group.toLowerCase() !== wantedGroup) {
            return false;
        }
        if (!wanted) {
            return true;
        }
        const said = [token.name, token.group, token.description ?? ""];
        return said.some((one) => one.toLowerCase().includes(wanted));
    });
};
