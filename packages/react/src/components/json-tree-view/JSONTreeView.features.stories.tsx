import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Link } from "../link";
import { JSONTreeView } from ".";

const classes = {
    container: "w-[var(--overlay-width-medium)]",
};

export default {
    title: "Components/JSONTreeView/Features",
    parameters: {
        layout: "centered",
    },
};

// Every Kind Of Value At Once, including the ones a JSON file has no way of writing down
export const DataTypes: StoryFn<typeof JSONTreeView> = () => (
    <div className={classes.container}>
        <JSONTreeView
            defaultExpandedDepth={1}
            data={{
                string: "a line of text",
                number: 42,
                huge: 9007199254740993n,
                boolean: false,
                nothing: null,
                missing: undefined,
                named: Symbol("badge"),
                when: new Date("2026-08-28T09:00:00.000Z"),
                list: [1, 2, 3],
                empty: {},
            }}
        />
    </div>
);

// Functions, Drawn As What They Are rather than as what they do, since what they do is not
// something a tree has any way of showing
export const Functions: StoryFn<typeof JSONTreeView> = () => (
    <div className={classes.container}>
        <JSONTreeView
            data={[
                function sum(a: number, b: number) {
                    return a + b;
                },
                async (promises: Promise<unknown>[]) => await Promise.all(promises),
                function* countdown(from: number) {
                    while (from > 0) {
                        yield (from -= 1);
                    }
                },
            ]}
        />
    </div>
);

// Regular Expressions, kept exactly as they were written, flags and all
export const RegularExpressions: StoryFn<typeof JSONTreeView> = () => (
    <div className={classes.container}>
        <JSONTreeView
            data={{
                slug: /^[a-z0-9-]+$/,
                anyCase: /^(?:[a-z0-9]+)foo.*?/i,
            }}
        />
    </div>
);

// An Error Opened Onto What It Is Worth Reading. An error keeps all of that behind names an
// ordinary walk of it passes over, so they are asked for by name rather than waited for
export const Errors: StoryFn<typeof JSONTreeView> = () => (
    <div className={classes.container}>
        <JSONTreeView data={new Error("Could not reach the server")} defaultExpandedDepth={1} />
    </div>
);

// Maps And Sets, drawn under the names they were made by and counted the way each is counted
export const MapsAndSets: StoryFn<typeof JSONTreeView> = () => (
    <div className={classes.container}>
        <JSONTreeView
            defaultExpandedDepth={1}
            data={
                new Map<string, unknown>([
                    ["name", "base-ui"],
                    ["license", "MIT"],
                    ["elements", new Set(["react", 123, false, null])],
                    ["nested", new Map([["depth", 2]])],
                ])
            }
        />
    </div>
);

// How Far Down It Opens To Begin With. Nought opens none of them, so every row gives a glimpse of
// what it holds instead
export const ExpandedDepth: StoryFn<typeof JSONTreeView> = () => {
    const data = {
        team: { name: "Design", members: [{ name: "Ada" }, { name: "Grace" }] },
    };

    return (
        <div className={classes.container}>
            <JSONTreeView data={data} defaultExpandedDepth={0} aria-label="Closed" />
            <JSONTreeView data={data} defaultExpandedDepth={3} aria-label="Open" />
        </div>
    );
};

// Drawing A Value Some Other Way, for a value that is worth more than the text of it. Handed each
// piece of the written-out value; given nothing back, the component draws the piece as it would
export const RenderValue: StoryFn<typeof JSONTreeView> = () => (
    <div className={classes.container}>
        <JSONTreeView
            defaultExpandedDepth={1}
            data={{
                name: "John Doe",
                email: "john.doe@example.com",
                website: "https://example.com",
            }}
            renderValue={(token) => {
                if (token.type !== "string") {
                    return undefined;
                }

                const text = token.text.replace(/^"(.*)"$/, "$1");

                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
                    return <Link href={`mailto:${text}`}>{token.text}</Link>;
                }

                return undefined;
            }}
        />
    </div>
);

// A List Too Long To Open All At Once, broken into runs named for the stretch they cover so that
// it is read a run at a time
export const GroupedArrays: StoryFn<typeof JSONTreeView> = () => (
    <div className={classes.container}>
        <JSONTreeView
            data={{ readings: Array.from({ length: 60 }, (_, index) => index * 3) }}
            groupArraysAfterLength={20}
            defaultExpandedDepth={1}
        />
    </div>
);

// The Names An Ordinary Walk Passes Over, which is where a list keeps its length and an object
// keeps whatever was hung on it out of sight
export const NonEnumerable: StoryFn<typeof JSONTreeView> = () => {
    const readings = [1, 2, 3];

    Object.defineProperty(readings, "takenAt", {
        value: "2026-08-28",
        enumerable: false,
    });

    return (
        <div className={classes.container}>
            <JSONTreeView data={{ readings }} defaultExpandedDepth={2} showNonEnumerable />
        </div>
    );
};

// Written The Way A JSON File Writes It, with the names in quotes and the long strings cut
export const QuotedKeys: StoryFn<typeof JSONTreeView> = () => (
    <div className={classes.container}>
        <JSONTreeView
            quotesOnKeys
            collapseStringsAfterLength={24}
            defaultExpandedDepth={1}
            data={{
                title: "A heading long enough that it has to be cut somewhere",
                published: true,
            }}
        />
    </div>
);

// A Value That Holds Itself, which the tree has to stop somewhere
export const Circular: StoryFn<typeof JSONTreeView> = () => {
    const looping: Record<string, unknown> = { name: "root" };
    looping.self = looping;
    looping.child = { parent: looping };

    return (
        <div className={classes.container}>
            <JSONTreeView data={looping} defaultExpandedDepth={2} />
        </div>
    );
};
