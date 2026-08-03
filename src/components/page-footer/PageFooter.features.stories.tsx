import type { StoryFn } from "@storybook/react-vite";
import {
    ArrowUpRegular,
    CubeRegular,
    GlobeRegular,
    HeartRegular,
} from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { Hidden } from "../hidden";
import { IconButton } from "../icon-button";
import { Link } from "../link";
import { Text } from "../text";
import { PageFooter } from ".";

const classes = {
    page: "p-[var(--base-size-16)]",
    navigation: "flex list-none flex-wrap gap-[var(--base-size-16)] m-0 p-0",
    columns: "grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-[var(--base-size-16)]",
    column: "flex list-none flex-col gap-[var(--base-size-4)] m-0 p-0",
    columnTitle:
        "m-0 pb-[var(--base-size-4)] [font-size:inherit] [font-weight:var(--base-text-weight-semibold)] text-foreground-default",
};

export default {
    title: "Components/PageFooter/Features",
    parameters: {
        layout: "fullscreen",
    },
};

// Copyright Only, which is all a simple page needs
export const CopyrightOnly: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site">
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
        </PageFooter>
    </div>
);

// Condensed, for the foot of a page inside an app rather than the foot of a site
export const Condensed: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site" variant="condensed">
            <PageFooter.LeadingVisual>
                <CubeRegular />
            </PageFooter.LeadingVisual>
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
        </PageFooter>
    </div>
);

// With A Leading Visual, which says whose page this is
export const WithLeadingVisual: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site">
            <PageFooter.LeadingVisual>
                <CubeRegular />
            </PageFooter.LeadingVisual>
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
        </PageFooter>
    </div>
);

// With Navigation, which moves on to the pages the reader is left with
export const WithNavigation: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site">
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
                    <li>
                        <Link href="#security" muted>
                            Security
                        </Link>
                    </li>
                    <li>
                        <Link href="#status" muted>
                            Status
                        </Link>
                    </li>
                    <li>
                        <Link href="#docs" muted>
                            Docs
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

// With Navigation In Columns, for a site with more to point at than fits on one line
export const WithNavigationColumns: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site">
            <PageFooter.Navigation as="nav" aria-label="Site">
                <div className={classes.columns}>
                    <ul className={classes.column}>
                        <li className={classes.columnTitle}>Product</li>
                        <li>
                            <Link href="#features" muted>
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link href="#pricing" muted>
                                Pricing
                            </Link>
                        </li>
                    </ul>
                    <ul className={classes.column}>
                        <li className={classes.columnTitle}>Company</li>
                        <li>
                            <Link href="#about" muted>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="#careers" muted>
                                Careers
                            </Link>
                        </li>
                    </ul>
                    <ul className={classes.column}>
                        <li className={classes.columnTitle}>Support</li>
                        <li>
                            <Link href="#docs" muted>
                                Docs
                            </Link>
                        </li>
                        <li>
                            <Link href="#contact" muted>
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </PageFooter.Navigation>
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
        </PageFooter>
    </div>
);

// With Actions, which act from the foot of the page rather than on the page itself
export const WithActions: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site">
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
            <PageFooter.Actions>
                <Button size="small" leadingVisual={GlobeRegular}>
                    English
                </Button>
                <IconButton
                    size="small"
                    aria-label="Back to top"
                    icon={ArrowUpRegular}
                    variant="invisible"
                />
            </PageFooter.Actions>
        </PageFooter>
    </div>
);

// With A Description, which holds the small print under the closing line
export const WithDescription: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site">
            <PageFooter.LeadingVisual>
                <CubeRegular />
            </PageFooter.LeadingVisual>
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
            <PageFooter.Description>
                <Text size="small">
                    Prices are shown before tax. Read the <Link href="#terms">terms</Link> for what
                    is covered.
                </Text>
            </PageFooter.Description>
        </PageFooter>
    </div>
);

// With A Border, which is left off wherever a navigation stands at the head of the footer
export const WithBorder: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site" hasBorder>
            <PageFooter.LeadingVisual>
                <CubeRegular />
            </PageFooter.LeadingVisual>
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
        </PageFooter>
    </div>
);

// With A Part Hidden On Narrow Viewports, where there is no room for everything
export const WithNavigationHiddenOnNarrowViewport: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site" hasBorder>
            <PageFooter.Navigation as="nav" aria-label="Site" hidden={{ narrow: true }}>
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

// With Actions That Change With The Viewport, so that a narrow screen is given the short form
export const WithResponsiveActions: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site">
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
            <PageFooter.Actions>
                <Hidden when="narrow">
                    <Button size="small" leadingVisual={HeartRegular}>
                        Sponsor
                    </Button>
                </Hidden>
                <Hidden when={["regular", "wide"]}>
                    <IconButton size="small" aria-label="Sponsor" icon={HeartRegular} />
                </Hidden>
            </PageFooter.Actions>
        </PageFooter>
    </div>
);

// A Size That Changes With The Viewport
export const WithResponsiveVariant: StoryFn<typeof PageFooter> = () => (
    <div className={classes.page}>
        <PageFooter aria-label="Site" variant={{ narrow: "condensed", regular: "normal" }}>
            <PageFooter.LeadingVisual>
                <CubeRegular />
            </PageFooter.LeadingVisual>
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
        </PageFooter>
    </div>
);
