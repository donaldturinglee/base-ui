import type { StoryFn, Meta } from "@storybook/react-vite";
import { CodeRegular, EyeRegular, PeopleRegular } from "@gamecrafters/base-ui-icons";
import { SegmentedControl } from ".";
import SegmentedControlButton from "./SegmentedControlButton";
import SegmentedControlIconButton from "./SegmentedControlIconButton";
import type { SegmentedControlProps, SegmentedControlVariant } from "./SegmentedControl.types";

// The width and the fallback are given per viewport range, so the playground offers a control
// for each of them rather than asking for an object to be written out
type PlaygroundArgs = {
    fullWidth: boolean;
    fullWidthAtNarrow: boolean;
    fullWidthAtRegular: boolean;
    fullWidthAtWide: boolean;
    size: SegmentedControlProps["size"];
    variantAtNarrow: SegmentedControlVariant;
    variantAtRegular: SegmentedControlVariant;
    variantAtWide: SegmentedControlVariant;
};

const variantOptions: SegmentedControlVariant[] = ["default", "hideLabels", "dropdown"];

export default {
    title: "Components/SegmentedControl",
    component: SegmentedControl,
    subcomponents: { SegmentedControlButton, SegmentedControlIconButton },
} as Meta<typeof SegmentedControl>;

export const Default: StoryFn<typeof SegmentedControl> = () => (
    <SegmentedControl aria-label="File view">
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
        <SegmentedControl.Button>Blame</SegmentedControl.Button>
    </SegmentedControl>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PlaygroundArgs> = (args) => (
    <SegmentedControl
        aria-label="File view"
        size={args.size}
        fullWidth={
            args.fullWidth
                ? args.fullWidth
                : {
                      narrow: args.fullWidthAtNarrow,
                      regular: args.fullWidthAtRegular,
                      wide: args.fullWidthAtWide,
                  }
        }
        variant={{
            narrow: args.variantAtNarrow,
            regular: args.variantAtRegular,
            wide: args.variantAtWide,
        }}
    >
        <SegmentedControl.Button defaultSelected leadingVisual={EyeRegular}>
            Preview
        </SegmentedControl.Button>
        <SegmentedControl.Button leadingVisual={CodeRegular}>Raw</SegmentedControl.Button>
        <SegmentedControl.Button leadingVisual={PeopleRegular}>Blame</SegmentedControl.Button>
    </SegmentedControl>
);

Playground.args = {
    fullWidth: false,
    fullWidthAtNarrow: false,
    fullWidthAtRegular: false,
    fullWidthAtWide: false,
    size: "medium",
    variantAtNarrow: "default",
    variantAtRegular: "default",
    variantAtWide: "default",
};

Playground.argTypes = {
    fullWidth: {
        control: {
            type: "boolean",
        },
        description: "Fills the width of its container at every viewport range",
    },
    fullWidthAtNarrow: {
        name: "fullWidth.narrow",
        control: {
            type: "boolean",
        },
    },
    fullWidthAtRegular: {
        name: "fullWidth.regular",
        control: {
            type: "boolean",
        },
    },
    fullWidthAtWide: {
        name: "fullWidth.wide",
        control: {
            type: "boolean",
        },
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium"],
        description: "How much room the segments are given",
    },
    variantAtNarrow: {
        name: "variant.narrow",
        control: {
            type: "radio",
        },
        options: variantOptions,
    },
    variantAtRegular: {
        name: "variant.regular",
        control: {
            type: "radio",
        },
        options: variantOptions,
    },
    variantAtWide: {
        name: "variant.wide",
        control: {
            type: "radio",
        },
        options: variantOptions,
    },
};

Playground.parameters = {
    layout: "centered",
};
