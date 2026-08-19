import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type StateLabelSize = "small" | "medium";

export type StateLabelStatus =
    | "open"
    | "closed"
    | "draft"
    | "archived"
    | "unavailable"
    | "issueOpened"
    | "issueClosed"
    | "issueClosedNotPlanned"
    | "issueDraft"
    | "pullOpened"
    | "pullClosed"
    | "pullMerged"
    | "pullQueued"
    | "alertOpened"
    | "alertClosed"
    | "alertFixed"
    | "alertDismissed";

export type StateLabelProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        status: StateLabelStatus;
        size?: StateLabelSize;
        className?: string;
    }
>;
