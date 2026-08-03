import type { StoryFn } from "@storybook/react-vite";
import { AddRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { Heading } from "../heading";
import { Link } from "../link";
import { PageFooter } from "../page-footer";
import { PageHeader } from "../page-header";
import { Text } from "../text";
import { PageContent } from ".";

const classes = {
    page: "p-[var(--base-size-16)]",
    section: "flex flex-col gap-[var(--stack-gap-condensed)]",
    outline: "border-solid border-[length:var(--border-width-thin)] border-border-default",
    navigation: "flex list-none flex-wrap gap-[var(--base-size-16)] m-0 p-0",
};

export default {
    title: "Components/PageContent/Features",
    parameters: {
        layout: "fullscreen",
    },
};

// One Section, which is all a simple page needs
export const OneSection: StoryFn<typeof PageContent> = () => (
    <div className={classes.page}>
        <PageContent>
            <PageContent.Section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>Webhooks let external services be notified when certain events happen.</Text>
            </PageContent.Section>
        </PageContent>
    </div>
);

// Held To A Width, so that a long line is never wider than can be read across
export const WithWidth: StoryFn<typeof PageContent> = () => (
    <div className={classes.page}>
        <PageContent width="medium" className={classes.outline}>
            <PageContent.Section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>
                    Webhooks let external services be notified when certain events happen. When the
                    event fires, a POST request is sent to each of the URLs given, and the reply is
                    kept so that a delivery can be looked over afterwards.
                </Text>
            </PageContent.Section>
        </PageContent>
    </div>
);

// With Padding, which leaves room around the content
export const WithPadding: StoryFn<typeof PageContent> = () => (
    <div className={classes.page}>
        <PageContent padding="spacious" className={classes.outline}>
            <PageContent.Section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>Webhooks let external services be notified when certain events happen.</Text>
            </PageContent.Section>
        </PageContent>
    </div>
);

// With A Gap, which leaves room between the runs of content
export const WithGap: StoryFn<typeof PageContent> = () => (
    <div className={classes.page}>
        <PageContent gap="spacious">
            <PageContent.Section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>Webhooks let external services be notified when certain events happen.</Text>
            </PageContent.Section>
            <PageContent.Section className={classes.section} aria-label="Recent deliveries">
                <Heading size="small">Recent deliveries</Heading>
                <Text>Nothing has been delivered in the last thirty days.</Text>
            </PageContent.Section>
        </PageContent>
    </div>
);

// With A Section Hidden On Narrow Viewports, where there is no room for everything
export const WithSectionHiddenOnNarrowViewport: StoryFn<typeof PageContent> = () => (
    <div className={classes.page}>
        <PageContent>
            <PageContent.Section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>Webhooks let external services be notified when certain events happen.</Text>
            </PageContent.Section>
            <PageContent.Section
                className={classes.section}
                aria-label="Recent deliveries"
                hidden={{ narrow: true }}
            >
                <Heading size="small">Recent deliveries</Heading>
                <Text>Nothing has been delivered in the last thirty days.</Text>
            </PageContent.Section>
        </PageContent>
    </div>
);

// Drawn As Something Else, where the page already carries a main of its own
export const WithCustomElement: StoryFn<typeof PageContent> = () => (
    <div className={classes.page}>
        <PageContent as="div">
            <PageContent.Section as="div" className={classes.section}>
                <Heading size="small">Webhooks</Heading>
                <Text>Webhooks let external services be notified when certain events happen.</Text>
            </PageContent.Section>
        </PageContent>
    </div>
);

// Between A Header And A Footer, which is the whole of a page
export const WithHeaderAndFooter: StoryFn<typeof PageContent> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Webhooks">
            <PageHeader.TitleArea>
                <PageHeader.Title>Webhooks</PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.Actions>
                <Button variant="primary" leadingVisual={AddRegular}>
                    New webhook
                </Button>
            </PageHeader.Actions>
        </PageHeader>
        <PageContent width="large" padding="normal" gap="spacious">
            <PageContent.Section className={classes.section} aria-label="About webhooks">
                <Heading size="small">About webhooks</Heading>
                <Text>
                    Webhooks let external services be notified when certain events happen. When the
                    event fires, a POST request is sent to each of the URLs given.
                </Text>
            </PageContent.Section>
            <PageContent.Section className={classes.section} aria-label="Recent deliveries">
                <Heading size="small">Recent deliveries</Heading>
                <Text>Nothing has been delivered in the last thirty days.</Text>
            </PageContent.Section>
        </PageContent>
        <PageFooter aria-label="Site" hasBorder>
            <PageFooter.Navigation as="nav" aria-label="Site">
                <ul className={classes.navigation}>
                    <li>
                        <Link href="#terms" muted>
                            Terms
                        </Link>
                    </li>
                    <li>
                        <Link href="#privacy" muted>
                            Privacy
                        </Link>
                    </li>
                </ul>
            </PageFooter.Navigation>
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
        </PageFooter>
    </div>
);
