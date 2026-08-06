import type { StoryFn } from "@storybook/react-vite";
import { Label } from "../label";
import { Token } from "../token";
import { LabelGroup } from ".";

const classes = {
    // Narrow enough that the row runs out of room, and dragged wider to watch it work the
    // labels out again
    resizable:
        "w-[var(--overlay-width-medium)] max-w-full min-w-[var(--base-size-96)] resize-x overflow-auto rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)] p-[var(--base-size-8)]",
};

const names = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
];

const labels = names.map((name) => <Label key={name}>{name}</Label>);

const tokens = names.map((name) => (
    <Token key={name} as="button" text={name} hideRemoveButton onClick={() => {}} />
));

export default {
    title: "Components/LabelGroup/Features",
};

// As Many As There Is Room For, worked out again whenever the room changes. Drag the corner of
// the frame to watch the count follow
export const TruncateAuto: StoryFn<typeof LabelGroup> = () => (
    <div className={classes.resizable}>
        <LabelGroup visibleChildCount="auto">{labels}</LabelGroup>
    </div>
);

// The same, holding labels that can be acted on. What has been held back is out of reach as
// well as out of sight, so the tab key never lands on something the reader cannot see
export const TruncateAutoWithInteractiveTokens: StoryFn<typeof LabelGroup> = () => (
    <div className={classes.resizable}>
        <LabelGroup visibleChildCount="auto">{tokens}</LabelGroup>
    </div>
);

// A Fixed Number, for a row that should read the same wherever it is shown rather than as much
// as this particular page has room for
export const TruncateAfterFive: StoryFn<typeof LabelGroup> = () => (
    <LabelGroup visibleChildCount={5}>{labels}</LabelGroup>
);

// Shown In Place, where the row wraps to hold everything rather than opening a panel over the
// page. Focus follows the labels as they come into view, and comes back to the count as they go
export const TruncateAutoExpandInline: StoryFn<typeof LabelGroup> = () => (
    <div className={classes.resizable}>
        <LabelGroup visibleChildCount="auto" overflowStyle="inline">
            {labels}
        </LabelGroup>
    </div>
);

export const TruncateAutoExpandInlineWithInteractiveTokens: StoryFn<typeof LabelGroup> = () => (
    <div className={classes.resizable}>
        <LabelGroup visibleChildCount="auto" overflowStyle="inline">
            {tokens}
        </LabelGroup>
    </div>
);

// Rendered As Something Other Than A List, for a row standing somewhere a list would not be
// read as one. The labels are held in spans rather than list items
export const AsDiv: StoryFn<typeof LabelGroup> = () => (
    <LabelGroup as="div" visibleChildCount={5}>
        {labels}
    </LabelGroup>
);
