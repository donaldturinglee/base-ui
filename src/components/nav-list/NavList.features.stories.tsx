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
import { NavList } from ".";

const classes = {
    // Gives the list a column to stand in rather than the width of the page
    container: "w-[16rem]",
};

export default {
    title: "Components/NavList/Features",
    parameters: {
        layout: "centered",
    },
};

// A heading, which names the list and the landmark it stands in
export const WithHeading: StoryFn<typeof NavList> = () => (
    <NavList className={classes.container}>
        <NavList.Heading>Settings</NavList.Heading>
        <NavList.Item href="#profile" aria-current="page">
            Profile
        </NavList.Item>
        <NavList.Item href="#account">Account</NavList.Item>
        <NavList.Item href="#security">Security</NavList.Item>
    </NavList>
);

// A heading kept from the page, for a list already named by what stands around it
export const VisuallyHiddenHeading: StoryFn<typeof NavList> = () => (
    <NavList className={classes.container}>
        <NavList.Heading visuallyHidden>Settings</NavList.Heading>
        <NavList.Item href="#profile" aria-current="page">
            Profile
        </NavList.Item>
        <NavList.Item href="#account">Account</NavList.Item>
    </NavList>
);

// Descriptions, where an item says more about itself than its name does
export const WithDescriptions: StoryFn<typeof NavList> = () => (
    <NavList aria-label="Settings" className={classes.container}>
        <NavList.Item href="#profile" aria-current="page">
            <NavList.LeadingVisual>
                <PersonRegular />
            </NavList.LeadingVisual>
            Profile
            <NavList.Description>Your name and public details</NavList.Description>
        </NavList.Item>
        <NavList.Item href="#account">
            <NavList.LeadingVisual>
                <KeyRegular />
            </NavList.LeadingVisual>
            Account
            <NavList.Description>Sign-in and recovery</NavList.Description>
        </NavList.Item>
    </NavList>
);

// Trailing visuals, which stand after the name and say something more about the item
export const WithTrailingVisuals: StoryFn<typeof NavList> = () => (
    <NavList aria-label="Settings" className={classes.container}>
        <NavList.Item href="#inbox" aria-current="page">
            <NavList.LeadingVisual>
                <AlertRegular />
            </NavList.LeadingVisual>
            Inbox
            <NavList.TrailingVisual>
                <CounterLabel>12</CounterLabel>
            </NavList.TrailingVisual>
        </NavList.Item>
        <NavList.Item href="#saved">
            <NavList.LeadingVisual>
                <StarRegular />
            </NavList.LeadingVisual>
            Saved
            <NavList.TrailingVisual>
                <CounterLabel>3</CounterLabel>
            </NavList.TrailingVisual>
        </NavList.Item>
    </NavList>
);

// A sub-list, which stands under the item that opens it
export const WithSubNav: StoryFn<typeof NavList> = () => (
    <NavList aria-label="Settings" className={classes.container}>
        <NavList.Item href="#profile">Profile</NavList.Item>
        <NavList.Item>
            Account
            <NavList.SubNav>
                <NavList.Item href="#email" aria-current="page">
                    Email
                </NavList.Item>
                <NavList.Item href="#password">Password</NavList.Item>
                <NavList.Item href="#sessions">Sessions</NavList.Item>
            </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#security">Security</NavList.Item>
    </NavList>
);

// A sub-list opened from the start, for a section a reader is expected to want
export const SubNavOpenByDefault: StoryFn<typeof NavList> = () => (
    <NavList aria-label="Settings" className={classes.container}>
        <NavList.Item href="#profile">Profile</NavList.Item>
        <NavList.Item defaultOpen>
            Account
            <NavList.SubNav>
                <NavList.Item href="#email">Email</NavList.Item>
                <NavList.Item href="#password">Password</NavList.Item>
            </NavList.SubNav>
        </NavList.Item>
    </NavList>
);

// Sub-lists within sub-lists, which the list draws one step further in at each turn
export const NestedSubNav: StoryFn<typeof NavList> = () => (
    <NavList aria-label="Docs" className={classes.container}>
        <NavList.Item href="#start">Getting started</NavList.Item>
        <NavList.Item>
            Components
            <NavList.SubNav>
                <NavList.Item href="#action-list">ActionList</NavList.Item>
                <NavList.Item>
                    Forms
                    <NavList.SubNav>
                        <NavList.Item href="#text-input" aria-current="page">
                            TextInput
                        </NavList.Item>
                        <NavList.Item href="#checkbox">Checkbox</NavList.Item>
                    </NavList.SubNav>
                </NavList.Item>
            </NavList.SubNav>
        </NavList.Item>
    </NavList>
);

// Groups, which collect related items under a heading of their own
export const WithGroups: StoryFn<typeof NavList> = () => (
    <NavList className={classes.container}>
        <NavList.Heading>Repository</NavList.Heading>
        <NavList.Group title="Code" hideDivider>
            <NavList.Item href="#files" aria-current="page">
                <NavList.LeadingVisual>
                    <CodeRegular />
                </NavList.LeadingVisual>
                Files
            </NavList.Item>
            <NavList.Item href="#commits">
                <NavList.LeadingVisual>
                    <DocumentRegular />
                </NavList.LeadingVisual>
                Commits
            </NavList.Item>
        </NavList.Group>
        <NavList.Group title="Docs">
            <NavList.Item href="#wiki">
                <NavList.LeadingVisual>
                    <BookRegular />
                </NavList.LeadingVisual>
                Wiki
            </NavList.Item>
        </NavList.Group>
    </NavList>
);

// A group heading written out, for a heading holding more than plain text
export const WithGroupHeading: StoryFn<typeof NavList> = () => (
    <NavList aria-label="Repository" className={classes.container}>
        <NavList.Group hideDivider>
            <NavList.GroupHeading>
                <Link href="#code">Code</Link>
            </NavList.GroupHeading>
            <NavList.Item href="#files" aria-current="page">
                Files
            </NavList.Item>
            <NavList.Item href="#commits">Commits</NavList.Item>
        </NavList.Group>
    </NavList>
);

// A long group, whose tail is held back until it is asked for
export const GroupExpand: StoryFn<typeof NavList> = () => (
    <NavList aria-label="Repository" className={classes.container}>
        <NavList.Group title="Repositories" hideDivider>
            <NavList.Item href="#base-ui" aria-current="page">
                <NavList.LeadingVisual>
                    <BookRegular />
                </NavList.LeadingVisual>
                base-ui
            </NavList.Item>
            <NavList.GroupExpand
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
        </NavList.Group>
    </NavList>
);

// A link component of the caller's own, for a list standing inside a router
export const CustomLinkComponent: StoryFn<typeof NavList> = () => {
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
        <NavList aria-label="Settings" className={classes.container}>
            <NavList.Item as={RouterLink} to="#profile" aria-current="page">
                Profile
            </NavList.Item>
            <NavList.Item as={RouterLink} to="#account">
                Account
            </NavList.Item>
        </NavList>
    );
};
