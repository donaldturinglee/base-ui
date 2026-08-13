import { describe, expect, it } from "vitest";
import { readProps, readTypeNames } from "./props";

const source = `
import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type ThingVariant = "default" | "primary";

export type ThingBaseProps = {
    variant?: ThingVariant;
    // Fills the width of its container
    block?: boolean;
    onOpen?: (
        gesture: ThingVariant,
        event?: React.MouseEvent<HTMLElement>,
    ) => void;
};

export type ThingProps<As extends React.ElementType = "button"> = PolymorphicProps<
    As,
    "button",
    ThingBaseProps & {
        // What the thing is
        // called
        label: string;
    }
>;

export type ThingPartProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "title"
> & {
    className?: string;
};

type ThingContextValue = {
    open: boolean;
};
`;

const read = () => readProps("Thing.types.ts", source);

const find = (name: string) => {
    const group = read().find((one) => one.name === name);
    if (!group) {
        throw new Error(`${name} was not read`);
    }
    return group;
};

const prop = (group: string, name: string) => {
    const found = find(group).props.find((one) => one.name === name);
    if (!found) {
        throw new Error(`${group} has no ${name}`);
    }
    return found;
};

describe("readProps", () => {
    it("reads a props type the file exports", () => {
        expect(read().map((group) => group.name)).toEqual([
            "ThingBaseProps",
            "ThingProps",
            "ThingPartProps",
        ]);
    });

    it("leaves alone a type that is not props for anything", () => {
        expect(read().map((group) => group.name)).not.toContain("ThingContextValue");
    });

    it("says whether a prop has to be passed", () => {
        expect(prop("ThingProps", "label").required).toBe(true);
        expect(prop("ThingProps", "block").required).toBe(false);
    });

    it("takes what a prop is for from the comment above it", () => {
        expect(prop("ThingProps", "block").description).toBe("Fills the width of its container");
    });

    it("reads a comment written over more than one line as one line", () => {
        expect(prop("ThingProps", "label").description).toBe("What the thing is called");
    });

    it("lists the values of a prop whose type names them", () => {
        expect(prop("ThingProps", "variant").options).toEqual(["default", "primary"]);
        expect(prop("ThingProps", "variant").type).toBe("ThingVariant");
    });

    it("does not list values for a prop whose type describes a shape", () => {
        expect(prop("ThingProps", "label").options).toBeUndefined();
    });

    it("adds the as prop a polymorphic component is drawn through", () => {
        expect(prop("ThingProps", "as").required).toBe(false);
    });

    it("names the element a polymorphic component brings the props of", () => {
        expect(find("ThingProps").inherits).toEqual(['ComponentPropsWithRef<"button">']);
    });

    it("keeps a type it cannot take apart as it was written, on one line", () => {
        expect(find("ThingPartProps").inherits).toEqual([
            'Omit<React.ComponentPropsWithoutRef<"div">, "title">',
        ]);
    });

    it("reads a type broken over several lines as the one line it stands for", () => {
        expect(prop("ThingProps", "onOpen").type).toBe(
            "(gesture: ThingVariant, event?: React.MouseEvent<HTMLElement>) => void",
        );
    });

    it("says which props types were only ever built on", () => {
        expect(find("ThingProps").reached).toContain("ThingBaseProps");
        expect(find("ThingBaseProps").reached).toEqual([]);
    });
});

describe("readTypeNames", () => {
    it("names every type the file exports", () => {
        expect(readTypeNames("Thing.types.ts", source)).toEqual([
            "ThingVariant",
            "ThingBaseProps",
            "ThingProps",
            "ThingPartProps",
        ]);
    });
});
