import { describe, expect, it } from "vitest";
import { readStories } from "./stories";

const source = `import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { AddRegular } from "@gamecrafters/base-ui-icons";
import { Stack } from "../stack";
import { Thing } from ".";
import type { ThingProps } from "./Thing.types";

const LABELS = ["one", "two"];

const unused = "nothing reaches for this";

export default {
    title: "Components/Thing",
    component: Thing,
} as Meta<typeof Thing>;

// The Plain One
export const Default: StoryFn<typeof Thing> = () => <Thing>Save</Thing>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ThingProps> = (args) => <Thing {...args} />;

Playground.argTypes = {
    variant: {
        control: {
            type: "radio",
        },
        options: ["default", "primary"],
        description: "How much weight it carries",
    },
};

export const LabelScale: StoryFn<typeof Thing> = () => (
    <Stack>
        {LABELS.map((label) => (
            <Thing key={label} leadingVisual={AddRegular}>
                {label}
            </Thing>
        ))}
    </Stack>
);
`;

const read = () => readStories("Thing.stories.tsx", source, "@gamecrafters/base-ui/react");

const example = (title: string) => {
    const found = read().examples.find((one) => one.title === title);
    if (!found) {
        throw new Error(`no example is titled ${title}`);
    }
    return found;
};

describe("readStories", () => {
    it("reads a story as an example and leaves the playground out of them", () => {
        expect(read().examples.map((one) => one.title)).toEqual(["The Plain One", "Label Scale"]);
    });

    it("titles a story from the comment above it, and from its name otherwise", () => {
        expect(read().examples[0]?.title).toBe("The Plain One");
        expect(read().examples[1]?.title).toBe("Label Scale");
    });

    it("drops the framing that only made it a story", () => {
        const { source: written } = example("The Plain One");
        expect(written).toContain("const Default = () => <Thing>Save</Thing>;");
        expect(written).not.toContain("StoryFn");
        expect(written).not.toContain("export const");
    });

    it("imports what the library exports from the package rather than from a path", () => {
        expect(example("The Plain One").source).toContain(
            'import { Thing } from "@gamecrafters/base-ui/react";',
        );
    });

    it("leaves an import of another package as it was written", () => {
        expect(example("Label Scale").source).toContain(
            'import { AddRegular } from "@gamecrafters/base-ui-icons";',
        );
    });

    it("imports only what the example it is written for reaches for", () => {
        expect(example("The Plain One").source).not.toContain("Stack");
        expect(example("Label Scale").source).toContain(
            'import { Stack, Thing } from "@gamecrafters/base-ui/react";',
        );
    });

    it("brings along a declaration the example reaches for beside itself", () => {
        expect(example("Label Scale").source).toContain('const LABELS = ["one", "two"];');
        expect(example("Label Scale").source).not.toContain("unused");
        expect(example("The Plain One").source).not.toContain("LABELS");
    });

    it("reads what the playground says about a prop", () => {
        expect(read().docs.variant).toEqual({
            description: "How much weight it carries",
            options: ["default", "primary"],
        });
    });
});
