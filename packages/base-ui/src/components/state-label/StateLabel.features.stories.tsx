import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import StateLabel from "./StateLabel";

export default {
    title: "Components/StateLabel/Features",
    parameters: {
        layout: "centered",
    },
};

// Issue States
export const IssueStates: StoryFn<typeof StateLabel> = () => (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <StateLabel status="issueOpened">Open</StateLabel>
        <StateLabel status="issueClosed">Closed</StateLabel>
        <StateLabel status="issueClosedNotPlanned">Closed</StateLabel>
        <StateLabel status="issueDraft">Draft</StateLabel>
    </Stack>
);

// Pull Request States
export const PullRequestStates: StoryFn<typeof StateLabel> = () => (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <StateLabel status="pullOpened">Open</StateLabel>
        <StateLabel status="pullClosed">Closed</StateLabel>
        <StateLabel status="pullMerged">Merged</StateLabel>
        <StateLabel status="pullQueued">Queued</StateLabel>
        <StateLabel status="draft">Draft</StateLabel>
    </Stack>
);

// Alert States
export const AlertStates: StoryFn<typeof StateLabel> = () => (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <StateLabel status="alertOpened">Open</StateLabel>
        <StateLabel status="alertFixed">Fixed</StateLabel>
        <StateLabel status="alertDismissed">Dismissed</StateLabel>
        <StateLabel status="alertClosed">Closed</StateLabel>
    </Stack>
);

// Generic States, which carry no icon of their own
export const GenericStates: StoryFn<typeof StateLabel> = () => (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <StateLabel status="open">Open</StateLabel>
        <StateLabel status="closed">Closed</StateLabel>
        <StateLabel status="archived">Archived</StateLabel>
        <StateLabel status="unavailable">Unavailable</StateLabel>
    </Stack>
);

// Small Size
export const SizeSmall: StoryFn<typeof StateLabel> = () => (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <StateLabel status="issueOpened" size="small">
            Open
        </StateLabel>
        <StateLabel status="pullMerged" size="small">
            Merged
        </StateLabel>
        <StateLabel status="closed" size="small">
            Closed
        </StateLabel>
    </Stack>
);
