import * as React from "react";
import {
    ArchiveRegular,
    CheckmarkCircleRegular,
    CircleHintRegular,
    ClockRegular,
    DismissCircleRegular,
    MergeRegular,
    ProhibitedRegular,
    RecordRegular,
    ShieldCheckmarkRegular,
    ShieldDismissRegular,
    ShieldErrorRegular,
    ShieldRegular,
    BranchRegular,
    WarningRegular,
} from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StateLabelProps, StateLabelSize, StateLabelStatus } from "./StateLabel.types";

type StateLabelTone = "open" | "closed" | "done" | "draft" | "attention" | "neutral";

// Several statuses share a colour, so they are grouped by the tone they carry rather than
// spelling the same classes out for each one
const tones = {
    open: "open",
    issueOpened: "open",
    pullOpened: "open",
    alertOpened: "open",
    closed: "done",
    issueClosed: "done",
    pullMerged: "done",
    alertFixed: "done",
    pullClosed: "closed",
    alertClosed: "closed",
    issueClosedNotPlanned: "neutral",
    unavailable: "neutral",
    archived: "neutral",
    pullQueued: "attention",
    draft: "draft",
    issueDraft: "draft",
    alertDismissed: "draft",
} satisfies Record<StateLabelStatus, StateLabelTone>;

// The generic open and closed statuses carry no icon, so the label alone says what they are
const icons = {
    open: null,
    closed: null,
    draft: CircleHintRegular,
    archived: ArchiveRegular,
    unavailable: WarningRegular,
    issueOpened: RecordRegular,
    issueClosed: CheckmarkCircleRegular,
    issueClosedNotPlanned: ProhibitedRegular,
    issueDraft: CircleHintRegular,
    pullOpened: BranchRegular,
    pullClosed: DismissCircleRegular,
    pullMerged: MergeRegular,
    pullQueued: ClockRegular,
    alertOpened: ShieldRegular,
    alertClosed: ShieldErrorRegular,
    alertFixed: ShieldCheckmarkRegular,
    alertDismissed: ShieldDismissRegular,
} satisfies Record<StateLabelStatus, React.ElementType | null>;

// Names the kind of thing the state belongs to, so the icon reads as more than a shape
const iconLabels = {
    open: "",
    closed: "",
    draft: "Pull request",
    archived: "Archived",
    unavailable: "",
    issueOpened: "Issue",
    issueClosed: "Issue",
    issueClosedNotPlanned: "Issue, not planned",
    issueDraft: "Issue",
    pullOpened: "Pull request",
    pullClosed: "Pull request",
    pullMerged: "Pull request",
    pullQueued: "Pull request",
    alertOpened: "Alert",
    alertClosed: "Alert",
    alertFixed: "Alert",
    alertDismissed: "Alert",
} satisfies Record<StateLabelStatus, string>;

const stateLabelVariants = cva("state-label", {
    variants: {
        size: {
            small: "state-label-small",
            medium: "state-label-medium",
        } satisfies Record<StateLabelSize, string>,
        tone: {
            open: "state-label-open",
            closed: "state-label-closed",
            done: "state-label-done",
            draft: "state-label-draft",
            attention: "state-label-attention",
            neutral: "state-label-neutral",
        } satisfies Record<StateLabelTone, string>,
    },
});

const stateLabelIconVariants = cva("state-label-visual", {
    variants: {
        size: {
            small: "state-label-visual-small",
            medium: "state-label-visual-medium",
        } satisfies Record<StateLabelSize, string>,
    },
});

function StateLabel<As extends React.ElementType = "span">(
    props: StateLabelProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        status,
        size = "medium",
        children,
        ...rest
        // `status` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as StateLabelProps<"span">;

    const Icon = icons[status];
    const iconLabel = iconLabels[status];

    return (
        <Component
            ref={ref}
            className={classNames(stateLabelVariants({ size, tone: tones[status] }), className)}
            data-component="StateLabel"
            data-status={status}
            data-size={size}
            {...rest}
        >
            {Icon ? (
                <Icon
                    className={classNames(stateLabelIconVariants({ size }))}
                    role={iconLabel ? "img" : undefined}
                    aria-label={iconLabel || undefined}
                    aria-hidden={iconLabel ? undefined : true}
                />
            ) : null}
            {children}
        </Component>
    );
}

StateLabel.displayName = "StateLabel";

export default fixedForwardRef(StateLabel);
