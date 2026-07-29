import type { StoryFn } from "@storybook/react-vite";
import {
    ArrowSortRegular,
    BookmarkRegular,
    CopyRegular,
    DeleteRegular,
    EditRegular,
    ShareRegular,
    TextBoldRegular,
    TextItalicRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionBar } from ".";

const classes = {
    // A narrow container is what puts the later items of the bar into the overflow menu
    wide: "w-[26rem] border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)] rounded-[var(--border-radius-medium)]",
    narrow: "w-[12rem] border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)] rounded-[var(--border-radius-medium)]",
};

export default {
    title: "Components/ActionBar/Features",
    parameters: {
        layout: "centered",
    },
};

// Overflow, where whatever no longer fits is offered from the menu at the end of the bar
export const Overflow: StoryFn<typeof ActionBar> = () => (
    <div className={classes.narrow}>
        <ActionBar aria-label="File actions">
            <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
            <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
            <ActionBar.IconButton icon={ShareRegular} aria-label="Share" />
            <ActionBar.IconButton icon={BookmarkRegular} aria-label="Bookmark" />
            <ActionBar.IconButton icon={DeleteRegular} aria-label="Delete" />
        </ActionBar>
    </div>
);

// Sizes, which set how much room each item of the bar is given
export const Sizes: StoryFn<typeof ActionBar> = () => (
    <>
        {(["small", "medium", "large"] as const).map((size) => (
            <div key={size} className={classes.wide}>
                <ActionBar size={size} aria-label={`File actions, ${size}`}>
                    <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
                    <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
                    <ActionBar.IconButton icon={ShareRegular} aria-label="Share" />
                </ActionBar>
            </div>
        ))}
    </>
);

// Buttons With Labels, for actions whose icons would not say enough on their own
export const LabelledButtons: StoryFn<typeof ActionBar> = () => (
    <div className={classes.wide}>
        <ActionBar aria-label="Review actions">
            <ActionBar.Button leadingVisual={EditRegular}>Rename</ActionBar.Button>
            <ActionBar.Button leadingVisual={CopyRegular}>Copy link</ActionBar.Button>
            <ActionBar.Button leadingVisual={ShareRegular}>Share</ActionBar.Button>
        </ActionBar>
    </div>
);

// Groups, whose items are carried into the overflow menu all at once
export const Groups: StoryFn<typeof ActionBar> = () => (
    <div className={classes.wide}>
        <ActionBar aria-label="Text actions">
            <ActionBar.Group>
                <ActionBar.IconButton icon={TextBoldRegular} aria-label="Bold" />
                <ActionBar.IconButton icon={TextItalicRegular} aria-label="Italic" />
            </ActionBar.Group>
            <ActionBar.Divider />
            <ActionBar.Group>
                <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
                <ActionBar.IconButton icon={ShareRegular} aria-label="Share" />
            </ActionBar.Group>
        </ActionBar>
    </div>
);

// A Menu In The Bar, which is offered as a menu within the overflow menu once it no longer
// fits
export const Menus: StoryFn<typeof ActionBar> = () => (
    <div className={classes.narrow}>
        <ActionBar aria-label="File actions">
            <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
            <ActionBar.Menu
                icon={ArrowSortRegular}
                aria-label="Sort by"
                items={[
                    { label: "Newest" },
                    { label: "Oldest" },
                    { type: "divider" },
                    { label: "Most commented" },
                ]}
            />
            <ActionBar.IconButton icon={ShareRegular} aria-label="Share" />
            <ActionBar.IconButton icon={DeleteRegular} aria-label="Delete" />
        </ActionBar>
    </div>
);

// Flush With Its Container, for a bar that is drawn against an edge rather than within one
export const Flush: StoryFn<typeof ActionBar> = () => (
    <div className={classes.wide}>
        <ActionBar flush aria-label="File actions">
            <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
            <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
        </ActionBar>
    </div>
);
