import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import {
    AlertRegular,
    BookRegular,
    CodeRegular,
    DocumentRegular,
    KeyRegular,
    PersonRegular,
    StarRegular,
} from "@gamecrafters/base-ui-icons";
import { CounterLabel } from "../counter-label";
import { Link } from "../link";
import { NavigationList } from ".";

const classes = {
    // Gives the list a column to stand in rather than the width of the page
    container: "w-[16rem]",
};

export default {
    title: "Components/NavigationList/Features",
    parameters: {
        layout: "centered",
    },
};

// A heading, which names the list and the landmark it stands in
export const WithHeading: StoryFn<typeof NavigationList> = () => (
    <NavigationList className={classes.container}>
        <NavigationList.Heading>Settings</NavigationList.Heading>
        <NavigationList.Item href="#profile" aria-current="page">
            Profile
        </NavigationList.Item>
        <NavigationList.Item href="#account">Account</NavigationList.Item>
        <NavigationList.Item href="#security">Security</NavigationList.Item>
    </NavigationList>
);

// A heading kept from the page, for a list already named by what stands around it
export const VisuallyHiddenHeading: StoryFn<typeof NavigationList> = () => (
    <NavigationList className={classes.container}>
        <NavigationList.Heading visuallyHidden>Settings</NavigationList.Heading>
        <NavigationList.Item href="#profile" aria-current="page">
            Profile
        </NavigationList.Item>
        <NavigationList.Item href="#account">Account</NavigationList.Item>
    </NavigationList>
);

// Descriptions, where an item says more about itself than its name does
export const WithDescriptions: StoryFn<typeof NavigationList> = () => (
    <NavigationList aria-label="Settings" className={classes.container}>
        <NavigationList.Item href="#profile" aria-current="page">
            <NavigationList.LeadingVisual>
                <PersonRegular />
            </NavigationList.LeadingVisual>
            Profile
            <NavigationList.Description>Your name and public details</NavigationList.Description>
        </NavigationList.Item>
        <NavigationList.Item href="#account">
            <NavigationList.LeadingVisual>
                <KeyRegular />
            </NavigationList.LeadingVisual>
            Account
            <NavigationList.Description>Sign-in and recovery</NavigationList.Description>
        </NavigationList.Item>
    </NavigationList>
);

// Trailing visuals, which stand after the name and say something more about the item
export const WithTrailingVisuals: StoryFn<typeof NavigationList> = () => (
    <NavigationList aria-label="Settings" className={classes.container}>
        <NavigationList.Item href="#inbox" aria-current="page">
            <NavigationList.LeadingVisual>
                <AlertRegular />
            </NavigationList.LeadingVisual>
            Inbox
            <NavigationList.TrailingVisual>
                <CounterLabel>12</CounterLabel>
            </NavigationList.TrailingVisual>
        </NavigationList.Item>
        <NavigationList.Item href="#saved">
            <NavigationList.LeadingVisual>
                <StarRegular />
            </NavigationList.LeadingVisual>
            Saved
            <NavigationList.TrailingVisual>
                <CounterLabel>3</CounterLabel>
            </NavigationList.TrailingVisual>
        </NavigationList.Item>
    </NavigationList>
);

// A sub-list, which stands under the item that opens it
export const WithSubNavigation: StoryFn<typeof NavigationList> = () => (
    <NavigationList aria-label="Settings" className={classes.container}>
        <NavigationList.Item href="#profile">Profile</NavigationList.Item>
        <NavigationList.Item>
            Account
            <NavigationList.SubNavigation>
                <NavigationList.Item href="#email" aria-current="page">
                    Email
                </NavigationList.Item>
                <NavigationList.Item href="#password">Password</NavigationList.Item>
                <NavigationList.Item href="#sessions">Sessions</NavigationList.Item>
            </NavigationList.SubNavigation>
        </NavigationList.Item>
        <NavigationList.Item href="#security">Security</NavigationList.Item>
    </NavigationList>
);

// A sub-list opened from the start, for a section a reader is expected to want
export const SubNavigationOpenByDefault: StoryFn<typeof NavigationList> = () => (
    <NavigationList aria-label="Settings" className={classes.container}>
        <NavigationList.Item href="#profile">Profile</NavigationList.Item>
        <NavigationList.Item defaultOpen>
            Account
            <NavigationList.SubNavigation>
                <NavigationList.Item href="#email">Email</NavigationList.Item>
                <NavigationList.Item href="#password">Password</NavigationList.Item>
            </NavigationList.SubNavigation>
        </NavigationList.Item>
    </NavigationList>
);

// Sub-lists within sub-lists, which the list draws one step further in at each turn
export const NestedSubNavigation: StoryFn<typeof NavigationList> = () => (
    <NavigationList aria-label="Docs" className={classes.container}>
        <NavigationList.Item href="#start">Getting started</NavigationList.Item>
        <NavigationList.Item>
            Components
            <NavigationList.SubNavigation>
                <NavigationList.Item href="#action-list">ActionList</NavigationList.Item>
                <NavigationList.Item>
                    Forms
                    <NavigationList.SubNavigation>
                        <NavigationList.Item href="#text-input" aria-current="page">
                            TextInput
                        </NavigationList.Item>
                        <NavigationList.Item href="#checkbox">Checkbox</NavigationList.Item>
                    </NavigationList.SubNavigation>
                </NavigationList.Item>
            </NavigationList.SubNavigation>
        </NavigationList.Item>
    </NavigationList>
);

// Groups, which collect related items under a heading of their own
export const WithGroups: StoryFn<typeof NavigationList> = () => (
    <NavigationList className={classes.container}>
        <NavigationList.Heading>Repository</NavigationList.Heading>
        <NavigationList.Group title="Code" hideDivider>
            <NavigationList.Item href="#files" aria-current="page">
                <NavigationList.LeadingVisual>
                    <CodeRegular />
                </NavigationList.LeadingVisual>
                Files
            </NavigationList.Item>
            <NavigationList.Item href="#commits">
                <NavigationList.LeadingVisual>
                    <DocumentRegular />
                </NavigationList.LeadingVisual>
                Commits
            </NavigationList.Item>
        </NavigationList.Group>
        <NavigationList.Group title="Docs">
            <NavigationList.Item href="#wiki">
                <NavigationList.LeadingVisual>
                    <BookRegular />
                </NavigationList.LeadingVisual>
                Wiki
            </NavigationList.Item>
        </NavigationList.Group>
    </NavigationList>
);

// A group heading written out, for a heading holding more than plain text
export const WithGroupHeading: StoryFn<typeof NavigationList> = () => (
    <NavigationList aria-label="Repository" className={classes.container}>
        <NavigationList.Group hideDivider>
            <NavigationList.GroupHeading>
                <Link href="#code">Code</Link>
            </NavigationList.GroupHeading>
            <NavigationList.Item href="#files" aria-current="page">
                Files
            </NavigationList.Item>
            <NavigationList.Item href="#commits">Commits</NavigationList.Item>
        </NavigationList.Group>
    </NavigationList>
);

// A long group, whose tail is held back until it is asked for
export const GroupExpand: StoryFn<typeof NavigationList> = () => (
    <NavigationList aria-label="Repository" className={classes.container}>
        <NavigationList.Group title="Repositories" hideDivider>
            <NavigationList.Item href="#base-ui" aria-current="page">
                <NavigationList.LeadingVisual>
                    <BookRegular />
                </NavigationList.LeadingVisual>
                base-ui
            </NavigationList.Item>
            <NavigationList.GroupExpand
                pages={2}
                label="Show more repositories"
                items={[
                    { text: "primitives", href: "#primitives", leadingVisual: BookRegular },
                    { text: "octicons", href: "#octicons", leadingVisual: BookRegular },
                    { text: "behaviors", href: "#behaviors", leadingVisual: BookRegular },
                    {
                        text: "view-components",
                        href: "#view-components",
                        leadingVisual: BookRegular,
                    },
                ]}
            />
        </NavigationList.Group>
    </NavigationList>
);

// A link component of the caller's own, for a list standing inside a router
export const CustomLinkComponent: StoryFn<typeof NavigationList> = () => {
    const RouterLink = ({
        to,
        children,
        ...rest
    }: React.ComponentPropsWithoutRef<"a"> & { to: string }) => (
        <a href={to} {...rest}>
            {children}
        </a>
    );

    return (
        <NavigationList aria-label="Settings" className={classes.container}>
            <NavigationList.Item as={RouterLink} to="#profile" aria-current="page">
                Profile
            </NavigationList.Item>
            <NavigationList.Item as={RouterLink} to="#account">
                Account
            </NavigationList.Item>
        </NavigationList>
    );
};
