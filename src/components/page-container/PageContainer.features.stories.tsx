import type { StoryFn } from "@storybook/react-vite";
import { AddRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { Heading } from "../heading";
import { Link } from "../link";
import { PageFooter } from "../page-footer";
import { PageHeader } from "../page-header";
import { Text } from "../text";
import { PageContainer } from ".";

const classes = {
    section: "flex flex-col gap-[var(--stack-gap-condensed)]",
    content: "flex flex-col gap-[var(--stack-gap-spacious)]",
    outline: "border-solid border-[length:var(--border-width-thin)] border-border-default",
    navigation: "flex list-none flex-wrap gap-[var(--base-size-16)] m-0 p-0",
};

export default {
    title: "Components/PageContainer/Features",
    parameters: {
        layout: "fullscreen",
    },
};

// Held To A Width, so that a long line is never wider than can be read across
export const WithWidth: StoryFn<typeof PageContainer> = () => (
    <PageContainer width="medium" className={classes.outline}>
        <PageContainer.Region as="main">
            <section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>
                    Webhooks let external services be notified when certain events happen. When the
                    event fires, a POST request is sent to each of the URLs given, and the reply is
                    kept so that a delivery can be looked over afterwards.
                </Text>
            </section>
        </PageContainer.Region>
    </PageContainer>
);

// With Padding, which leaves room between the page and the edge of the viewport
export const WithPadding: StoryFn<typeof PageContainer> = () => (
    <PageContainer padding="spacious" className={classes.outline}>
        <PageContainer.Region as="main">
            <section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>Webhooks let external services be notified when certain events happen.</Text>
            </section>
        </PageContainer.Region>
    </PageContainer>
);

// With A Gap, which leaves room between the regions of the page
export const WithGap: StoryFn<typeof PageContainer> = () => (
    <PageContainer gap="spacious">
        <PageContainer.Region className={classes.outline}>
            <Heading size="small">Webhooks</Heading>
        </PageContainer.Region>
        <PageContainer.Region className={classes.outline}>
            <Text>Nothing has been delivered in the last thirty days.</Text>
        </PageContainer.Region>
    </PageContainer>
);

// Standing The Height Of The Viewport, where the region carrying the page takes the room left
// over so the footer falls to the bottom of the screen rather than partway up it
export const WithFullHeight: StoryFn<typeof PageContainer> = () => (
    <PageContainer fullHeight>
        <PageContainer.Region>
            <PageHeader role="banner" aria-label="Webhooks">
                <PageHeader.TitleArea>
                    <PageHeader.Title>Webhooks</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>
        </PageContainer.Region>
        <PageContainer.Region as="main" grow>
            <section className={classes.section} aria-label="Webhooks">
                <Text>Nothing has been delivered in the last thirty days.</Text>
            </section>
        </PageContainer.Region>
        <PageContainer.Region>
            <PageFooter aria-label="Site" hasBorder>
                <PageFooter.Copyright>
                    <Text>© 2026 GameCrafters, Inc.</Text>
                </PageFooter.Copyright>
            </PageFooter>
        </PageContainer.Region>
    </PageContainer>
);

// With A Region Hidden On Narrow Viewports, where there is no room for everything
export const WithRegionHiddenOnNarrowViewport: StoryFn<typeof PageContainer> = () => (
    <PageContainer>
        <PageContainer.Region className={classes.outline}>
            <Heading size="small">Webhooks</Heading>
        </PageContainer.Region>
        <PageContainer.Region className={classes.outline} hidden={{ narrow: true }}>
            <Text>Nothing has been delivered in the last thirty days.</Text>
        </PageContainer.Region>
    </PageContainer>
);

// Drawn As Something Else, where the page is one long article rather than a set of regions
export const WithCustomElement: StoryFn<typeof PageContainer> = () => (
    <PageContainer as="article">
        <PageContainer.Region as="section">
            <Heading size="small">Webhooks</Heading>
            <Text>Webhooks let external services be notified when certain events happen.</Text>
        </PageContainer.Region>
    </PageContainer>
);

// The Whole Of A Page, which is what the container is for
export const WithHeaderContentAndFooter: StoryFn<typeof PageContainer> = () => (
    <PageContainer width="large" fullHeight>
        <PageContainer.Region>
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
        </PageContainer.Region>
        <PageContainer.Region as="main" className={classes.content} grow>
            <section className={classes.section} aria-label="About webhooks">
                <Heading size="small">About webhooks</Heading>
                <Text>
                    Webhooks let external services be notified when certain events happen. When the
                    event fires, a POST request is sent to each of the URLs given.
                </Text>
            </section>
            <section className={classes.section} aria-label="Recent deliveries">
                <Heading size="small">Recent deliveries</Heading>
                <Text>Nothing has been delivered in the last thirty days.</Text>
            </section>
        </PageContainer.Region>
        <PageContainer.Region>
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
        </PageContainer.Region>
    </PageContainer>
);
