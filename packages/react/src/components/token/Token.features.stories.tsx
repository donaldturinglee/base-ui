import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { PersonRegular, StarRegular } from "@gamecrafters/base-ui-icons";
import { Stack } from "../stack";
import { IssueLabelToken, Token } from ".";
import type { TokenSize } from "./Token.types";

const sizes: TokenSize[] = ["small", "medium", "large", "xlarge"];

export default {
    title: "Components/Token/Features",
    parameters: {
        layout: "centered",
    },
};

// Sizes, which set how much room the token is given
export const Sizes: StoryFn<typeof Token> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {sizes.map((size) => (
            <Token key={size} size={size} text={size} />
        ))}
    </Stack>
);

// A Leading Visual, which stands before the text. A small token has no room for one
export const LeadingVisual: StoryFn<typeof Token> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {sizes.map((size) => (
            <Token key={size} size={size} text="monalisa" leadingVisual={PersonRegular} />
        ))}
    </Stack>
);

// Tokens That Can Be Taken Back Out, either by the button or by Backspace and Delete
export const Removable: StoryFn<typeof Token> = () => {
    const [tokens, setTokens] = React.useState(["zero", "one", "two", "three"]);

    return (
        <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
            {tokens.map((token) => (
                <Token
                    key={token}
                    text={token}
                    onRemove={() => setTokens((current) => current.filter((one) => one !== token))}
                />
            ))}
        </Stack>
    );
};

// A Token That Leads Somewhere, rendered as the link or the button it stands for
export const Interactive: StoryFn<typeof Token> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        <Token as="a" href="#" text="A link" />
        <Token as="button" text="A button" onClick={() => {}} />
        <Token text="Neither" />
    </Stack>
);

// A Token That Both Leads Somewhere And Can Be Taken Back Out, which holds two things to
// press, so the remove button stands beside what the token leads to rather than inside it
export const InteractiveAndRemovable: StoryFn<typeof Token> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        <Token as="a" href="#" text="monalisa" onRemove={() => {}} />
        <Token as="button" text="octocat" onClick={() => {}} onRemove={() => {}} />
    </Stack>
);

// Selected Tokens, which are the ones that have been picked out of the rest
export const Selected: StoryFn<typeof Token> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        <Token text="Picked" isSelected leadingVisual={StarRegular} />
        <Token text="Not picked" leadingVisual={StarRegular} />
    </Stack>
);

// Tokens That Cannot Be Used, which answer neither pointer nor key
export const Disabled: StoryFn<typeof Token> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        <Token as="button" text="Disabled" disabled onClick={() => {}} />
    </Stack>
);

// A Token With No Remove Button, for a list that is emptied some other way
export const HiddenRemoveButton: StoryFn<typeof Token> = () => (
    <Token text="monalisa" onRemove={() => {}} hideRemoveButton />
);

// Issue Labels, which are drawn in a colour of their own. Every other colour on them is
// worked out from that one, so the text stays readable whichever colour it is given
export const IssueLabels: StoryFn<typeof IssueLabelToken> = () => (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <IssueLabelToken text="bug" fillColor="#d73a4a" />
        <IssueLabelToken text="documentation" fillColor="#0075ca" />
        <IssueLabelToken text="good first issue" fillColor="#7057ff" />
        <IssueLabelToken text="help wanted" fillColor="#008672" />
        <IssueLabelToken text="wontfix" fillColor="#ffffff" />
        <IssueLabelToken text="no colour given" />
    </Stack>
);

// Issue Labels That Can Be Picked Out And Taken Back Out, in the same way tokens can
export const IssueLabelStates: StoryFn<typeof IssueLabelToken> = () => (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <IssueLabelToken text="picked" fillColor="#d73a4a" isSelected />
        <IssueLabelToken text="removable" fillColor="#0075ca" onRemove={() => {}} />
        <IssueLabelToken text="a link" fillColor="#7057ff" as="a" href="#" />
    </Stack>
);
