import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from "../button";
import type { ButtonSize } from "../button";
import { ButtonGroup } from ".";
import type { ButtonGroupProps } from "./ButtonGroup.types";

// The buttons belong to the story rather than the group, so their controls are kept apart
// from the ones the group itself takes
type PlaygroundArgs = ButtonGroupProps & {
    buttonCount: number;
    size: ButtonSize;
    disabled: boolean;
};

export default {
    title: "Components/ButtonGroup",
    component: ButtonGroup,
} as Meta<typeof ButtonGroup>;

export const Default: StoryFn<typeof ButtonGroup> = () => (
    <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
    </ButtonGroup>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PlaygroundArgs> = ({ buttonCount, size, disabled, ...args }) => (
    <ButtonGroup {...args}>
        {Array.from({ length: buttonCount }, (_, index) => (
            <Button key={index} size={size} disabled={disabled}>
                {`Button ${index + 1}`}
            </Button>
        ))}
    </ButtonGroup>
);

Playground.args = {
    role: "group",
    buttonCount: 3,
    size: "medium",
    disabled: false,
};

Playground.argTypes = {
    role: {
        control: {
            type: "radio",
        },
        options: ["group", "toolbar"],
        description:
            "The role of the group. A toolbar is a single tab stop that the arrow keys move within",
    },
    buttonCount: {
        control: {
            type: "number",
            min: 2,
            max: 6,
            step: 1,
        },
        description: "How many buttons the group holds",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "How tall the buttons are, and how much padding they carry",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the buttons being used",
    },
    ref: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
