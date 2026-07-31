import type { StoryFn, Meta } from "@storybook/react-vite";
import { ArrowUpRegular, CubeRegular } from "@gamecrafters/base-ui-icons";
import { IconButton } from "../icon-button";
import { Link } from "../link";
import { Text } from "../text";
import { PageFooter } from ".";
import type { PageFooterProps } from "./PageFooter.types";

const classes = {
    page: "p-[var(--base-size-16)]",
    navigation: "flex list-none flex-wrap gap-[var(--base-size-16)] m-0 p-0",
};

export default {
    title: "Components/PageFooter",
    component: PageFooter,
    parameters: {
        layout: "fullscreen",
    },
} as Meta<typeof PageFooter>;

export const Default: StoryFn<typeof PageFooter> = () => (
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
                        <Link href="#docs" muted>
                            Docs
                        </Link>
                    </li>
                </ul>
            </PageFooter.Navigation>
            <PageFooter.LeadingVisual>
                <CubeRegular />
            </PageFooter.LeadingVisual>
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
            <PageFooter.Actions>
                <IconButton aria-label="Back to top" icon={ArrowUpRegular} variant="invisible" />
            </PageFooter.Actions>
        </PageFooter>
    </div>
);

export const Playground: StoryFn<PageFooterProps> = (args) => (
    <div className={classes.page}>
        <PageFooter {...args}>
            <PageFooter.LeadingVisual>
                <CubeRegular />
            </PageFooter.LeadingVisual>
            <PageFooter.Copyright>
                <Text>© 2026 GameCrafters, Inc.</Text>
            </PageFooter.Copyright>
            <PageFooter.Actions>
                <IconButton aria-label="Back to top" icon={ArrowUpRegular} variant="invisible" />
            </PageFooter.Actions>
        </PageFooter>
    </div>
);

Playground.args = {
    "aria-label": "Site",
    variant: "normal",
    hasBorder: false,
};

Playground.argTypes = {
    variant: {
        control: {
            type: "radio",
        },
        options: ["normal", "condensed"],
        description: "Which size the footer is set in",
    },
    hasBorder: {
        control: {
            type: "boolean",
        },
        description: "Draws a line above the footer, where no navigation stands at its head",
    },
    as: {
        control: {
            type: "text",
        },
        description: "Which element the footer is drawn as",
    },
    "aria-label": {
        control: {
            type: "text",
        },
        description: "Names the landmark the footer stands for",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
