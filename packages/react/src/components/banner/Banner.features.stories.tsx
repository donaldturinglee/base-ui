import type { StoryFn } from "@storybook/react-vite";
import { SparkleRegular } from "@gamecrafters/base-ui-icons";
import { Heading } from "../heading";
import { Link } from "../link";
import { Stack } from "../stack";
import { Banner } from ".";
import type { BannerVariant } from "./Banner.types";

const classes = {
    // Gives the layout stories a container narrow enough for the banner to respond to
    narrow: "w-[20rem]",
    wide: "w-[48rem]",
    icon: "size-[var(--base-size-20)]",
};

const description = (
    <>
        Everyone reaching this repository is{" "}
        <Link inline href="#">
            now required
        </Link>{" "}
        to turn on two-factor authentication.
    </>
);

const actions = {
    primaryAction: <Banner.PrimaryAction>Turn it on</Banner.PrimaryAction>,
    secondaryAction: <Banner.SecondaryAction>Read more</Banner.SecondaryAction>,
};

export default {
    title: "Components/Banner/Features",
};

// Variant Scale
export const VariantScale: StoryFn<typeof Banner> = () => (
    <Stack gap="normal">
        {(["critical", "info", "success", "upsell", "warning"] as const).map((variant) => (
            <Banner
                key={variant}
                variant={variant}
                title={variant}
                description={`A ${variant} banner.`}
            />
        ))}
    </Stack>
);

// Dismissible
export const Dismissible: StoryFn<typeof Banner> = () => (
    <Banner title="Notice" description={description} onDismiss={() => {}} />
);

// With Actions
export const WithActions: StoryFn<typeof Banner> = () => (
    <Banner variant="warning" title="Warning" description={description} {...actions} />
);

// Dismissible With Actions, where the actions drop below the content to leave room for the
// dismiss button
export const DismissibleWithActions: StoryFn<typeof Banner> = () => (
    <Banner title="Notice" description={description} onDismiss={() => {}} {...actions} />
);

// With A Hidden Title, which still names the region
export const WithAHiddenTitle: StoryFn<typeof Banner> = () => (
    <Banner variant="warning" title="Warning" hideTitle description={description} />
);

// With A Hidden Title And Actions
export const WithAHiddenTitleAndActions: StoryFn<typeof Banner> = () => (
    <Banner variant="warning" title="Warning" hideTitle description={description} {...actions} />
);

// With A Leading Visual, which only the info and upsell variants leave room for
export const WithALeadingVisual: StoryFn<typeof Banner> = () => (
    <Banner
        variant="upsell"
        title="Upsell"
        description="A banner carrying a visual of its own."
        leadingVisual={<SparkleRegular className={classes.icon} />}
        onDismiss={() => {}}
    />
);

// Compact, which keeps the same shape on less padding
export const Compact: StoryFn<typeof Banner> = () => (
    <Banner
        layout="compact"
        title="Info"
        description="A banner for somewhere room is short."
        onDismiss={() => {}}
    />
);

// Flush, for a banner that spans the box holding it
export const Flush: StoryFn<typeof Banner> = () => (
    <Banner
        flush
        variant="critical"
        title="Something went wrong loading custom fields."
        description="Please try again."
        actionsLayout="inline"
        primaryAction={<Banner.PrimaryAction>Try again</Banner.PrimaryAction>}
    />
);

// Actions Laid Out Inline, which keeps the actions beside the content until the viewport is
// narrow
export const ActionsLaidOutInline: StoryFn<typeof Banner> = () => (
    <Stack gap="spacious">
        <Stack gap="condensed" className={classes.narrow}>
            <Heading as="h3" size="small">
                In a narrow container
            </Heading>
            <Banner
                variant="warning"
                title="A short title"
                aria-label="Inline actions, narrow"
                description="A very short message."
                actionsLayout="inline"
                {...actions}
            />
        </Stack>
        <Stack gap="condensed" className={classes.wide}>
            <Heading as="h3" size="small">
                In a wide container
            </Heading>
            <Banner
                variant="warning"
                title="A short title"
                aria-label="Inline actions, wide"
                description="A very short message."
                actionsLayout="inline"
                {...actions}
            />
        </Stack>
    </Stack>
);

// Actions Laid Out Stacked, which drops them below the content whatever the room
export const ActionsLaidOutStacked: StoryFn<typeof Banner> = () => (
    <Stack gap="spacious">
        <Stack gap="condensed" className={classes.narrow}>
            <Heading as="h3" size="small">
                In a narrow container
            </Heading>
            <Banner
                title="Stacked actions"
                aria-label="Stacked actions, narrow"
                description="The actions stand below the content either way."
                actionsLayout="stacked"
                {...actions}
            />
        </Stack>
        <Stack gap="condensed" className={classes.wide}>
            <Heading as="h3" size="small">
                In a wide container
            </Heading>
            <Banner
                title="Stacked actions"
                aria-label="Stacked actions, wide"
                description="The actions stand below the content either way."
                actionsLayout="stacked"
                {...actions}
            />
        </Stack>
    </Stack>
);

// With A Title Given As A Child, in place of the title prop
export const WithATitleGivenAsAChild: StoryFn<typeof Banner> = () => (
    <Banner variant="success">
        <Banner.Title as="h3">Success</Banner.Title>
        <Banner.Description>Two-factor authentication is on.</Banner.Description>
    </Banner>
);

// Every Variant Dismissible
export const EveryVariantDismissible: StoryFn<typeof Banner> = () => {
    const variants: BannerVariant[] = ["critical", "info", "success", "upsell", "warning"];

    return (
        <Stack gap="normal">
            {variants.map((variant) => (
                <Banner
                    key={variant}
                    variant={variant}
                    title={variant}
                    description={`A ${variant} banner that can be dismissed.`}
                    onDismiss={() => {}}
                />
            ))}
        </Stack>
    );
};
