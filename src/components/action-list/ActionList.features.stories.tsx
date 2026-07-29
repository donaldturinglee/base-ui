import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import {
    ArchiveRegular,
    BookmarkRegular,
    CopyRegular,
    DeleteRegular,
    EditRegular,
    EyeRegular,
    LinkRegular,
    PersonRegular,
    SettingsRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionList } from ".";

const classes = {
    // Gives the list a width to sit in rather than the width of the page
    container: "w-[22rem]",
};

export default {
    title: "Components/ActionList/Features",
    parameters: {
        layout: "centered",
    },
};

// Leading And Trailing Visuals, which say what an item does and what doing it costs
export const Visuals: StoryFn<typeof ActionList> = () => (
    <ActionList className={classes.container}>
        <ActionList.Item>
            <ActionList.LeadingVisual>
                <CopyRegular />
            </ActionList.LeadingVisual>
            Copy link
            <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item>
            <ActionList.LeadingVisual>
                <EditRegular />
            </ActionList.LeadingVisual>
            Rename
            <ActionList.TrailingVisual>⌘R</ActionList.TrailingVisual>
        </ActionList.Item>
    </ActionList>
);

// Descriptions, standing beside the label or below it
export const Descriptions: StoryFn<typeof ActionList> = () => (
    <ActionList className={classes.container}>
        <ActionList.Item>
            Public
            <ActionList.Description>Anyone can read this</ActionList.Description>
        </ActionList.Item>
        <ActionList.Item>
            Private
            <ActionList.Description variant="block">
                Only the people you have named can read this, and only they can write to it
            </ActionList.Description>
        </ActionList.Item>
    </ActionList>
);

// Single Selection, where picking one item puts back the one that was picked before
export const SingleSelection: StoryFn<typeof ActionList> = () => {
    const options = ["Newest", "Oldest", "Most commented"];
    const [selected, setSelected] = React.useState(options[0]);

    return (
        <ActionList
            role="listbox"
            aria-label="Sort by"
            selectionVariant="single"
            className={classes.container}
        >
            {options.map((option) => (
                <ActionList.Item
                    key={option}
                    selected={option === selected}
                    onSelect={() => setSelected(option)}
                >
                    {option}
                </ActionList.Item>
            ))}
        </ActionList>
    );
};

// Multiple Selection, where each item is picked and put back on its own
export const MultipleSelection: StoryFn<typeof ActionList> = () => {
    const options = ["Issues", "Pull requests", "Discussions"];
    const [selected, setSelected] = React.useState<string[]>(["Issues"]);

    const toggle = (option: string) =>
        setSelected((current) =>
            current.includes(option)
                ? current.filter((one) => one !== option)
                : [...current, option],
        );

    return (
        <ActionList
            role="listbox"
            aria-label="Show"
            selectionVariant="multiple"
            className={classes.container}
        >
            {options.map((option) => (
                <ActionList.Item
                    key={option}
                    selected={selected.includes(option)}
                    onSelect={() => toggle(option)}
                >
                    {option}
                </ActionList.Item>
            ))}
        </ActionList>
    );
};

// Groups, which collect related items under a heading of their own
export const Groups: StoryFn<typeof ActionList> = () => (
    <ActionList className={classes.container}>
        <ActionList.Group>
            <ActionList.GroupHeading as="h3">This file</ActionList.GroupHeading>
            <ActionList.Item>
                <ActionList.LeadingVisual>
                    <CopyRegular />
                </ActionList.LeadingVisual>
                Copy link
            </ActionList.Item>
            <ActionList.Item>
                <ActionList.LeadingVisual>
                    <EditRegular />
                </ActionList.LeadingVisual>
                Rename
            </ActionList.Item>
        </ActionList.Group>
        <ActionList.Group>
            <ActionList.GroupHeading as="h3" variant="filled">
                Everything in it
            </ActionList.GroupHeading>
            <ActionList.Item>
                <ActionList.LeadingVisual>
                    <ArchiveRegular />
                </ActionList.LeadingVisual>
                Archive
            </ActionList.Item>
            <ActionList.Item variant="danger">
                <ActionList.LeadingVisual>
                    <DeleteRegular />
                </ActionList.LeadingVisual>
                Delete
            </ActionList.Item>
        </ActionList.Group>
    </ActionList>
);

// A Heading, which names the list it stands at the top of
export const Heading: StoryFn<typeof ActionList> = () => (
    <ActionList className={classes.container}>
        <ActionList.Heading as="h2">Settings</ActionList.Heading>
        <ActionList.Item>
            <ActionList.LeadingVisual>
                <PersonRegular />
            </ActionList.LeadingVisual>
            Your profile
        </ActionList.Item>
        <ActionList.Item>
            <ActionList.LeadingVisual>
                <SettingsRegular />
            </ActionList.LeadingVisual>
            Preferences
        </ActionList.Item>
    </ActionList>
);

// Link Items, which are somewhere to go rather than something to do
export const LinkItems: StoryFn<typeof ActionList> = () => (
    <ActionList className={classes.container}>
        <ActionList.LinkItem href="#profile">
            <ActionList.LeadingVisual>
                <PersonRegular />
            </ActionList.LeadingVisual>
            Your profile
        </ActionList.LinkItem>
        <ActionList.LinkItem href="#stars" active>
            <ActionList.LeadingVisual>
                <BookmarkRegular />
            </ActionList.LeadingVisual>
            Your stars
        </ActionList.LinkItem>
        <ActionList.LinkItem href="#links">
            <ActionList.LeadingVisual>
                <LinkRegular />
            </ActionList.LeadingVisual>
            Your links
        </ActionList.LinkItem>
    </ActionList>
);

// Trailing Actions, which stand beside the item rather than inside it
export const TrailingActions: StoryFn<typeof ActionList> = () => (
    <ActionList className={classes.container}>
        <ActionList.Item>
            main.ts
            <ActionList.TrailingAction icon={CopyRegular} label="Copy the path to main.ts" />
        </ActionList.Item>
        <ActionList.Item>
            index.ts
            <ActionList.TrailingAction icon={CopyRegular} label="Copy the path to index.ts" />
        </ActionList.Item>
    </ActionList>
);

// Items That Cannot Be Used, either for now or at all
export const UnusableItems: StoryFn<typeof ActionList> = () => (
    <ActionList className={classes.container}>
        <ActionList.Item disabled>
            <ActionList.LeadingVisual>
                <EditRegular />
            </ActionList.LeadingVisual>
            Rename
        </ActionList.Item>
        <ActionList.Item loading>
            <ActionList.LeadingVisual>
                <EyeRegular />
            </ActionList.LeadingVisual>
            Watching
        </ActionList.Item>
        <ActionList.Item inactiveText="Unavailable while the repository is being moved">
            <ActionList.LeadingVisual>
                <ArchiveRegular />
            </ActionList.LeadingVisual>
            Archive
        </ActionList.Item>
    </ActionList>
);

// Dividers Between Items, for a list that is read as a table of them
export const Dividers: StoryFn<typeof ActionList> = () => (
    <ActionList showDividers className={classes.container}>
        <ActionList.Item>
            Public
            <ActionList.Description>Anyone can read this</ActionList.Description>
        </ActionList.Item>
        <ActionList.Item>
            Private
            <ActionList.Description>Only you can read this</ActionList.Description>
        </ActionList.Item>
        <ActionList.Item>
            Internal
            <ActionList.Description>
                Anyone in the organisation can read this
            </ActionList.Description>
        </ActionList.Item>
    </ActionList>
);

// Sizes, which set how much room each item is given
export const Sizes: StoryFn<typeof ActionList> = () => (
    <ActionList className={classes.container}>
        <ActionList.Item size="medium">A medium item</ActionList.Item>
        <ActionList.Item size="large">A large item</ActionList.Item>
    </ActionList>
);
