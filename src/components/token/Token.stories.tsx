import type { StoryFn, Meta } from "@storybook/react-vite";
import { PersonRegular } from "@gamecrafters/base-ui-icons";
import { Token } from ".";
import type { TokenProps } from "./Token.types";

export default {
    title: "Components/Token",
    component: Token,
} as Meta<typeof Token>;

export const Default: StoryFn<typeof Token> = () => <Token text="monalisa" />;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TokenProps> = (args) => (
    <Token {...args} leadingVisual={args.leadingVisual ? PersonRegular : undefined} />
);

Playground.args = {
    text: "monalisa",
    size: "medium",
    isSelected: false,
    hideRemoveButton: false,
};

Playground.argTypes = {
    text: {
        control: {
            type: "text",
        },
        description: "What the token says",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large", "xlarge"],
        description: "How much room the token is given",
    },
    isSelected: {
        control: {
            type: "boolean",
        },
        description: "Whether the token is one of the ones that have been picked",
    },
    leadingVisual: {
        control: {
            type: "boolean",
        },
        description: "Stands before the text, where the token has room for one",
    },
    hideRemoveButton: {
        control: {
            type: "boolean",
        },
        description: "Leaves out the remove button",
    },
    onRemove: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
