import type { JSONNode, JSONNodeType, JSONTreeViewOptions } from "./JSONTreeView.types";

// How many of the names it holds a closed row gives away before it says only that there are more.
// Enough to tell one row from its neighbours, few enough that the line still reads as a glimpse of
// what is inside rather than as the whole of it written out twice
export const DEFAULT_MAX_PREVIEW_ITEMS = 5;

// The kinds of value that hold more of themselves, and so have something to open
const HOLDS_MORE = new Set<JSONNodeType>(["object", "array", "map", "set", "class", "error"]);

// What an error is worth reading is kept behind names an ordinary walk passes over, so they are
// asked for by name rather than waited for. `cause` is only there where it was given one
const ERROR_KEYS = ["name", "message", "stack", "cause"];

// One value in a thing that holds values, before it has been looked at. Everything turned up by a
// walk is called something; the one entry that is not is the value the whole tree was built from,
// where that value holds nothing and stands as a row on its own
type JSONEntry = {
    key?: string;
    value: unknown;
    nonEnumerable?: boolean;
};

// An entry a walk turned up, which is always called something
type NamedEntry = JSONEntry & { key: string };

// The plainest of objects: one made from a literal, or from nothing at all. Anything else carrying
// a constructor of its own is drawn under the name it was made by, so that an instance is told
// apart from the plain bag of names it would otherwise look like
const isPlainObject = (value: object) => {
    const prototype = Object.getPrototypeOf(value) as object | null;

    return prototype === null || prototype === Object.prototype;
};

// What a value turns out to be once it has been looked at. The built-in kinds are asked about
// before the plain ones, since a date and a list are both objects as far as `typeof` is concerned
// and neither is worth drawing as one
export const typeOf = (value: unknown): JSONNodeType => {
    if (value === null) {
        return "null";
    }

    switch (typeof value) {
        case "undefined":
            return "undefined";
        case "string":
            return "string";
        case "number":
            return "number";
        case "bigint":
            return "bigint";
        case "boolean":
            return "boolean";
        case "symbol":
            return "symbol";
        case "function":
            return "function";
        default:
            break;
    }

    if (Array.isArray(value)) {
        return "array";
    }

    if (value instanceof Map) {
        return "map";
    }

    if (value instanceof Set) {
        return "set";
    }

    if (value instanceof Date) {
        return "date";
    }

    if (value instanceof RegExp) {
        return "regex";
    }

    if (value instanceof Error) {
        return "error";
    }

    return isPlainObject(value as object) ? "object" : "class";
};

// The name a thing was made by, for the kinds that are drawn under one
export const constructorNameOf = (value: unknown) => {
    const name = (value as { constructor?: { name?: string } } | null)?.constructor?.name;

    return name === undefined || name === "" ? "Object" : name;
};

// What a key of a map is called. A map takes anything at all as a key, and a row has to be called
// something, so one that is not already a name is written the way it would be read
const toKeyText = (key: unknown) => {
    const type = typeOf(key);

    if (type === "string") {
        return key as string;
    }

    if (type === "class" || type === "object") {
        return constructorNameOf(key);
    }

    return String(key as string);
};

// The names a walk of a thing turns up, and the values under them. What counts as a name depends
// on what is doing the holding: a map keeps its own, a set counts its way through, and everything
// else keeps them as properties
const ownEntries = (value: object, showNonEnumerable: boolean): NamedEntry[] =>
    (showNonEnumerable ? Object.getOwnPropertyNames(value) : Object.keys(value)).map((key) => ({
        key,
        value: (value as Record<string, unknown>)[key],
        nonEnumerable: !Object.prototype.propertyIsEnumerable.call(value, key),
    }));

const entriesOf = (value: unknown, type: JSONNodeType, showNonEnumerable: boolean): JSONEntry[] => {
    if (type === "map") {
        return Array.from(value as Map<unknown, unknown>, ([key, held]) => ({
            key: toKeyText(key),
            value: held,
        }));
    }

    if (type === "set") {
        return Array.from(value as Set<unknown>, (held, index) => ({
            key: String(index),
            value: held,
        }));
    }

    if (type === "error") {
        const error = value as unknown as Record<string, unknown>;

        // Asked for by name first, then whatever else was hung on the error afterwards. The names
        // already taken are dropped from the second lot rather than drawn a second time
        const named = ERROR_KEYS.filter((key) => key in error && error[key] !== undefined).map(
            (key) => ({ key, value: error[key] }),
        );

        return [
            ...named,
            ...ownEntries(value as object, showNonEnumerable).filter(
                (entry) => !ERROR_KEYS.includes(entry.key),
            ),
        ];
    }

    return ownEntries(value as object, showNonEnumerable);
};

// A long list broken into runs of a given length, each run standing as a row of its own. A list
// that fits in one run is left as it was rather than being wrapped in a run holding all of it.
//
// The rows are gathered into runs once they have been read rather than before, so that a row keeps
// the same name whether or not the list it came out of was long enough to be broken up
const toRuns = (children: JSONNode[], size: number, id: string): JSONNode[] | null => {
    if (size <= 0 || children.length <= size) {
        return null;
    }

    return Array.from({ length: Math.ceil(children.length / size) }, (_, run) => {
        const from = run * size;
        const held = children.slice(from, from + size);

        return {
            // A run is told apart from the rows beside it, which are named for their places in
            // the list and so are all numbers
            id: `${id}.r${run}`,
            // Named for the stretch it covers rather than counted from one, so that the name of a
            // run says where in the list its rows came from
            key: `${from} … ${from + held.length - 1}`,
            type: "array" as const,
            value: held.map((child) => child.value),
            children: held,
        };
    });
};

// Reads a value, and everything under it, into the rows the tree draws.
//
// The whole of it is read at once rather than a level at a time, since what a closed row gives
// away of what it holds is read off the rows underneath it, and a row that had not been read yet
// would have nothing to give away. Only the open ones are drawn, so a tree that has been read is
// still only as large on the page as it has been opened.
//
// `seen` is what stops a value that holds itself from being read for ever. It holds the values on
// the way down rather than every value read, so the same thing standing in two places is read in
// both rather than the second being taken for a loop
const toNode = (
    entry: JSONEntry,
    id: string,
    options: JSONTreeViewOptions,
    seen: Set<object>,
): JSONNode => {
    const type = typeOf(entry.value);

    const node: JSONNode = {
        id,
        key: entry.key,
        type,
        value: entry.value,
        nonEnumerable: entry.nonEnumerable,
    };

    if (!HOLDS_MORE.has(type)) {
        return node;
    }

    const held = entry.value as object;

    if (seen.has(held)) {
        return { ...node, type: "circular" };
    }

    seen.add(held);

    const children = entriesOf(entry.value, type, options.showNonEnumerable ?? false).map(
        (child, index) => toNode(child, `${id}.${index}`, options, seen),
    );

    seen.delete(held);

    // Only a list is worth breaking into runs. What an object holds is found by the names it is
    // held under rather than by counting along it, and a run of names is no easier to look through
    // than the names were
    const runs =
        type === "array" || type === "set"
            ? toRuns(children, options.groupArraysAfterLength ?? 0, id)
            : null;

    // A thing that holds values but turned out to hold none has nothing to open, so it is left as
    // a leaf and drawn as the pair of empty brackets it reads as. An arrow beside it would only
    // offer the reader a row that says there is nothing there
    if (children.length > 0) {
        node.children = runs ?? children;
    }

    return node;
};

// The rows at the top of the tree. A value that holds more of itself is opened out, so that the
// tree begins inside it rather than at a single row the reader has to open first; one that holds
// nothing stands as the one row it is
export const toJSONNodes = (data: unknown, options: JSONTreeViewOptions = {}): JSONNode[] => {
    const type = typeOf(data);

    if (!HOLDS_MORE.has(type)) {
        return [toNode({ value: data }, "0", options, new Set())];
    }

    const seen = new Set<object>([data as object]);

    return entriesOf(data, type, options.showNonEnumerable ?? false).map((entry, index) =>
        toNode(entry, String(index), options, seen),
    );
};
