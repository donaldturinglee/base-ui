import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Which side of the conversation the message is on. The speaker is not named by a label but by
// the side their messages come down, which is why the side is the one thing a message must know
export type MessageAlign = "start" | "end";

export type MessageGroupProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // The side every message in the run is on, unless one of them says otherwise
        align?: MessageAlign;
        className?: string;
    }
>;

export type MessageProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // Left unsaid, the message takes the side its run is on
        align?: MessageAlign;
        className?: string;
    }
>;

export type MessageAvatarProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type MessageContentProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type MessageHeaderProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type MessageFooterProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type MessageContextValue = {
    // The side the message is on, once the run has had its say. Read by what the message
    // carries, so a bubble inside one comes down the same side without being told twice
    align?: MessageAlign;
};

export type MessageGroupContextValue = {
    align?: MessageAlign;
};
