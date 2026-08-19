import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Which side of the conversation a turn stands on. A reader takes the side to mean the speaker
// without ever being told so, which is why it is worth naming rather than leaving to a margin
export type BubbleAlign = "start" | "end";

export type BubbleVariant =
    "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "danger";

// Which of the bubble's edges the reactions are hung over
export type BubbleReactionsSide = "top" | "bottom";

export type BubbleGroupProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // The side every turn in the run stands on. A speaker does not change sides part way
        // through a run, so it is named here rather than on each of them
        align?: BubbleAlign;
        className?: string;
    }
>;

export type BubbleProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        variant?: BubbleVariant;
        // Left unsaid, the turn stands on the side its run stands on
        align?: BubbleAlign;
        className?: string;
    }
>;

export type BubbleContentProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type BubbleReactionsProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        side?: BubbleReactionsSide;
        // Left unsaid, they gather at the corner the bubble's own side points to
        align?: BubbleAlign;
        className?: string;
    }
>;

export type BubbleContextValue = {
    // The side the turn stands on, once the run has had its say
    align?: BubbleAlign;
    variant?: BubbleVariant;
};

export type BubbleGroupContextValue = {
    align?: BubbleAlign;
};
