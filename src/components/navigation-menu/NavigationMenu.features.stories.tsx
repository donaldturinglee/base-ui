import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import {
    BookRegular,
    CodeRegular,
    DocumentRegular,
    RocketRegular,
    StarRegular,
} from "@gamecrafters/base-ui-icons";
import { CounterLabel } from "../counter-label";
import { Link } from "../link";
import { Text } from "../text";
import { NavigationMenu } from ".";

const classes = {
    // Gives the panels room to open into, rather than against the edge of the frame
    container: "p-[var(--base-size-24)] pb-[var(--base-size-64)]",
    stack: "flex flex-col items-start gap-[var(--base-size-16)]",
    // A column stands down the side of a page, so it is given the width one would have
    sidebar: "w-[var(--overlay-width-xsmall)]",
    // A panel holding more than a list of links lays out what it holds itself
    columns: "grid grid-cols-2 gap-[var(--base-size-16)]",
    // A panel of links that say something about themselves needs the room to say it
    wide: "w-[var(--overlay-width-medium)]",
    muted: "text-[var(--foreground-color-muted)]",
};

export default {
    title: "Components/NavigationMenu/Features",
};

// What Opens A Panel, where the pointer opens one as well as a press. The keys and the press
// still work, since a menu that only answered the pointer would be shut to anyone without one
export const OpensOnHover: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main" openOn="hover">
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href="#features">Features</NavigationMenu.Link>
                        <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href="#docs">Documentation</NavigationMenu.Link>
                        <NavigationMenu.Link href="#guides">Guides</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// Standing In A Column, which is a navigation list: the keys that moved along the row turn
// onto the other axis, and each panel is drawn in the flow under the item that opened it,
// stepped in from it, rather than standing over the page beside it
export const Vertical: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main" orientation="vertical" className={classes.sidebar}>
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href="#features">Features</NavigationMenu.Link>
                        <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href="#docs">Documentation</NavigationMenu.Link>
                        <NavigationMenu.Link href="#guides">Guides</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// Where The Panel Lines Up, for a panel wider than the item that opened it and standing near
// the end of the row
export const ContentAlignment: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main">
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Lines up at the start</NavigationMenu.Trigger>
                    <NavigationMenu.Content align="start">
                        <NavigationMenu.Link href="#features">Features</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Halfway along</NavigationMenu.Trigger>
                    <NavigationMenu.Content align="center">
                        <NavigationMenu.Link href="#docs">Documentation</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>At the end</NavigationMenu.Trigger>
                    <NavigationMenu.Content align="end">
                        <NavigationMenu.Link href="#support">Support</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// The Page Being Read, which is the one link in the menu that is not somewhere to go
export const ActiveLink: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main">
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href="#features" active>
                            Features
                        </NavigationMenu.Link>
                        <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// More Than A List Of Links, since a panel holds whatever the caller puts in it and lays it
// out itself. The groups keep their headings and their names; how they stand beside one
// another is the caller's to say
export const RichContent: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main">
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                    <NavigationMenu.Content className={classes.wide}>
                        <div className={classes.columns}>
                            <NavigationMenu.Group title="Build" hideDivider>
                                <NavigationMenu.Link href="#editor">Editor</NavigationMenu.Link>
                                <NavigationMenu.Link href="#actions">Actions</NavigationMenu.Link>
                            </NavigationMenu.Group>
                            <NavigationMenu.Group title="Ship" hideDivider>
                                <NavigationMenu.Link href="#packages">Packages</NavigationMenu.Link>
                                <NavigationMenu.Link href="#releases">Releases</NavigationMenu.Link>
                            </NavigationMenu.Group>
                        </div>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// A Heading, which names the menu and the landmark it stands in. A menu named this way needs
// nothing else said about it
export const WithHeading: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu orientation="vertical" className={classes.sidebar}>
            <NavigationMenu.Heading>Documentation</NavigationMenu.Heading>
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Link href="#start" active>
                        Getting started
                    </NavigationMenu.Link>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href="#action-list">ActionList</NavigationMenu.Link>
                        <NavigationMenu.Link href="#navigation-menu">
                            NavigationMenu
                        </NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// Groups, which collect related links under a heading of their own. A panel holding a few of
// these reads as several short lists rather than as one long one
export const WithGroups: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main">
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Group title="Build" hideDivider>
                            <NavigationMenu.Link href="#editor">
                                <NavigationMenu.LeadingVisual>
                                    <CodeRegular />
                                </NavigationMenu.LeadingVisual>
                                Editor
                            </NavigationMenu.Link>
                            <NavigationMenu.Link href="#actions">
                                <NavigationMenu.LeadingVisual>
                                    <RocketRegular />
                                </NavigationMenu.LeadingVisual>
                                Actions
                            </NavigationMenu.Link>
                        </NavigationMenu.Group>

                        <NavigationMenu.Group title="Learn">
                            <NavigationMenu.Link href="#docs">
                                <NavigationMenu.LeadingVisual>
                                    <BookRegular />
                                </NavigationMenu.LeadingVisual>
                                Documentation
                            </NavigationMenu.Link>
                            <NavigationMenu.Link href="#guides">
                                <NavigationMenu.LeadingVisual>
                                    <DocumentRegular />
                                </NavigationMenu.LeadingVisual>
                                Guides
                            </NavigationMenu.Link>
                        </NavigationMenu.Group>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// A group heading written out, for a heading holding more than plain text
export const WithGroupHeading: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main">
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Group hideDivider>
                            <NavigationMenu.GroupHeading>
                                <Link href="#build">Build</Link>
                            </NavigationMenu.GroupHeading>
                            <NavigationMenu.Link href="#editor">Editor</NavigationMenu.Link>
                            <NavigationMenu.Link href="#actions">Actions</NavigationMenu.Link>
                        </NavigationMenu.Group>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// Descriptions, where a link says more about itself than its name does. A panel is often the
// first a reader sees of what stands behind a link, so there is room here to say what that is
export const WithDescriptions: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main">
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                    <NavigationMenu.Content className={classes.wide}>
                        <NavigationMenu.Link href="#editor">
                            <NavigationMenu.LeadingVisual>
                                <CodeRegular />
                            </NavigationMenu.LeadingVisual>
                            Editor
                            <NavigationMenu.Description>
                                Write, review and ship without leaving the page
                            </NavigationMenu.Description>
                        </NavigationMenu.Link>
                        <NavigationMenu.Link href="#actions">
                            <NavigationMenu.LeadingVisual>
                                <RocketRegular />
                            </NavigationMenu.LeadingVisual>
                            Actions
                            <NavigationMenu.Description>
                                Run the work that follows every change
                            </NavigationMenu.Description>
                        </NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// Trailing visuals, which stand after the name and say something more about the link
export const WithTrailingVisuals: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main">
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href="#starred">
                            <NavigationMenu.LeadingVisual>
                                <StarRegular />
                            </NavigationMenu.LeadingVisual>
                            Starred
                            <NavigationMenu.TrailingVisual>
                                <CounterLabel>12</CounterLabel>
                            </NavigationMenu.TrailingVisual>
                        </NavigationMenu.Link>
                        <NavigationMenu.Link href="#guides">
                            <NavigationMenu.LeadingVisual>
                                <DocumentRegular />
                            </NavigationMenu.LeadingVisual>
                            Guides
                            <NavigationMenu.TrailingVisual>
                                <CounterLabel>3</CounterLabel>
                            </NavigationMenu.TrailingVisual>
                        </NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// A sub-list, which stands under the link it belongs to and is named by it. Nothing here opens
// or shuts: the panel it stands in is the thing that opens, and a reader who has already
// opened one should not have to open another to read what it holds
export const WithSubNavigation: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>
        <NavigationMenu aria-label="Main">
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href="#docs">
                            Documentation
                            <NavigationMenu.SubNavigation>
                                <NavigationMenu.Link href="#start">
                                    Getting started
                                </NavigationMenu.Link>
                                <NavigationMenu.Link href="#components">
                                    Components
                                    <NavigationMenu.SubNavigation>
                                        <NavigationMenu.Link href="#action-list">
                                            ActionList
                                        </NavigationMenu.Link>
                                        <NavigationMenu.Link href="#navigation-menu">
                                            NavigationMenu
                                        </NavigationMenu.Link>
                                    </NavigationMenu.SubNavigation>
                                </NavigationMenu.Link>
                            </NavigationMenu.SubNavigation>
                        </NavigationMenu.Link>
                        <NavigationMenu.Link href="#support">Support</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// Controlled, where the caller keeps hold of which panel stands open
export const Controlled: StoryFn<typeof NavigationMenu> = () => {
    const [value, setValue] = React.useState<string | null>("product");

    return (
        <div className={`${classes.container} ${classes.stack}`}>
            <NavigationMenu aria-label="Main" value={value} onValueChange={setValue}>
                <NavigationMenu.List>
                    <NavigationMenu.Item value="product">
                        <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                        <NavigationMenu.Content>
                            <NavigationMenu.Link href="#features">Features</NavigationMenu.Link>
                            <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item value="resources">
                        <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                        <NavigationMenu.Content>
                            <NavigationMenu.Link href="#docs">Documentation</NavigationMenu.Link>
                            <NavigationMenu.Link href="#guides">Guides</NavigationMenu.Link>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                </NavigationMenu.List>
            </NavigationMenu>

            <Text size="small" className={classes.muted}>
                {value === null ? "Nothing stands open." : `The ${value} panel stands open.`}
            </Text>
        </div>
    );
};
