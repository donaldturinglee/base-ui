import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Status } from ".";

const classes = {
    // Gives the column of services a width to line the dots up down
    container: "w-[16rem]",
};

// What a handful of services were last reported to be doing, so a column of them can be read
// the way it would be on a status page
const services = [
    { name: "API", variant: "success" },
    { name: "Webhooks", variant: "attention" },
    { name: "Search", variant: "severe" },
    { name: "Packages", variant: "danger" },
    { name: "Pages", variant: "neutral" },
] as const;

// Every colour a dot can be painted, for the row that shows them read apart from any words
const variants = ["accent", "success", "attention", "severe", "danger", "done", "neutral"] as const;

export default {
    title: "Components/Status/Features",
    parameters: {
        layout: "centered",
    },
};

// Accent Variant
export const Accent: StoryFn<typeof Status> = () => (
    <Status variant="accent">
        <Status.Indicator />
        In progress
    </Status>
);

// Success Variant
export const Success: StoryFn<typeof Status> = () => (
    <Status variant="success">
        <Status.Indicator />
        Operational
    </Status>
);

// Attention Variant
export const Attention: StoryFn<typeof Status> = () => (
    <Status variant="attention">
        <Status.Indicator />
        Degraded performance
    </Status>
);

// Severe Variant
export const Severe: StoryFn<typeof Status> = () => (
    <Status variant="severe">
        <Status.Indicator />
        Partial outage
    </Status>
);

// Danger Variant
export const Danger: StoryFn<typeof Status> = () => (
    <Status variant="danger">
        <Status.Indicator />
        Major outage
    </Status>
);

// Done Variant
export const Done: StoryFn<typeof Status> = () => (
    <Status variant="done">
        <Status.Indicator />
        Resolved
    </Status>
);

// Neutral Variant
export const Neutral: StoryFn<typeof Status> = () => (
    <Status variant="neutral">
        <Status.Indicator />
        Not monitored
    </Status>
);

// Small Size
export const Small: StoryFn<typeof Status> = () => (
    <Status size="small" variant="success">
        <Status.Indicator />
        Operational
    </Status>
);

// Medium Size
export const Medium: StoryFn<typeof Status> = () => (
    <Status size="medium" variant="success">
        <Status.Indicator />
        Operational
    </Status>
);

// Large Size
export const Large: StoryFn<typeof Status> = () => (
    <Status size="large" variant="success">
        <Status.Indicator />
        Operational
    </Status>
);

// In A Column, where the dots line up down the left and the eye runs the colour before it reads
// any of the words
export const InAColumn: StoryFn<typeof Status> = () => (
    <Stack gap="condensed" className={classes.container}>
        {services.map((service) => (
            <Status key={service.name} variant={service.variant}>
                <Status.Indicator />
                {service.name}
            </Status>
        ))}
    </Stack>
);

// Without A Label, where the row carries the dot alone and srText gives it the words a screen
// reader would otherwise not have
export const WithoutALabel: StoryFn<typeof Status> = () => (
    <Stack gap="condensed" direction="horizontal">
        {services.map((service) => (
            <Status key={service.name} variant={service.variant} srText={service.name}>
                <Status.Indicator />
            </Status>
        ))}
    </Stack>
);

// Beside Running Text, where the dot and the words take the size of the line they are read in
export const BesideRunningText: StoryFn<typeof Status> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["large", "medium", "small"] as const).map((size) => (
            <Text key={size} as="p" size={size}>
                <Status size={size} variant="success">
                    <Status.Indicator />
                    Operational
                </Status>{" "}
                as of a minute ago.
            </Text>
        ))}
    </Stack>
);

// An Indicator Asked For Its Own Colour, where the dot says something the words do not
export const OverriddenIndicator: StoryFn<typeof Status> = () => (
    <Status variant="neutral">
        <Status.Indicator variant="danger" />
        Not monitored, last seen failing
    </Status>
);

// An Indicator On Its Own, for a dot read where a status is not: beside an avatar, or in a cell
// too narrow for the words. Outside a status it answers for its own colour and size
export const IndicatorOnItsOwn: StoryFn<typeof Status> = () => (
    <Stack gap="condensed" direction="horizontal" align="center">
        {variants.map((variant) => (
            <Status.Indicator key={variant} variant={variant} size="large" />
        ))}
    </Stack>
);

// Custom Element, for a report that is read as a block of its own rather than as part of a line
export const CustomElement: StoryFn<typeof Status> = () => (
    <Status as="div" variant="attention">
        <Status.Indicator />
        Degraded performance
    </Status>
);
