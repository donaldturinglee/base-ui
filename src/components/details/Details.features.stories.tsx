import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { Details } from ".";

const classes = {
    // Gives the content a width to sit in rather than the width of the page
    container: "w-[20rem]",
};

export default {
    title: "Components/Details/Features",
    parameters: {
        layout: "centered",
    },
};

// With A Custom Summary, for markup that is already a summary of its own
export const WithCustomSummary: StoryFn<typeof Details> = () => (
    <Details className={classes.container}>
        <summary>See details</summary>
        <Text as="p">
            The branch was merged an hour ago, and the two commits on it are now on main.
        </Text>
    </Details>
);

// Open To Start, where there is nothing to be gained by hiding what is there
export const OpenToStart: StoryFn<typeof Details> = () => (
    <Details defaultOpen className={classes.container}>
        <Details.Summary as={Button}>See details</Details.Summary>
        <Text as="p">
            The branch was merged an hour ago, and the two commits on it are now on main.
        </Text>
    </Details>
);

// Close On Outside Click, for a disclosure standing over the page rather than in it
export const CloseOnOutsideClick: StoryFn<typeof Details> = () => (
    <Stack gap="condensed" className={classes.container}>
        <Details closeOnOutsideClick>
            <Details.Summary as={Button}>See details</Details.Summary>
            <Text as="p">
                The branch was merged an hour ago, and the two commits on it are now on main.
            </Text>
        </Details>
        <Text size="small">Clicking anywhere else closes it again.</Text>
    </Stack>
);

// Controlled, where the caller keeps hold of whether it is open
export const Controlled: StoryFn<typeof Details> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="condensed" className={classes.container}>
            <Details open={open} onChange={setOpen}>
                <Details.Summary as={Button}>See details</Details.Summary>
                <Text as="p">
                    The branch was merged an hour ago, and the two commits on it are now on main.
                </Text>
            </Details>
            <Stack direction="horizontal" gap="condensed">
                <Button size="small" onClick={() => setOpen(true)}>
                    Show
                </Button>
                <Button size="small" onClick={() => setOpen(false)}>
                    Hide
                </Button>
            </Stack>
            <Text size="small">{open ? "Open" : "Closed"}</Text>
        </Stack>
    );
};
