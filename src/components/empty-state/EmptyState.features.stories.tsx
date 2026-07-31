import type { StoryFn } from "@storybook/react-vite";
import {
    DocumentRegular,
    FilterDismissRegular,
    FolderRegular,
    SearchRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionList } from "../action-list";
import { Button } from "../button";
import { Link } from "../link";
import { EmptyState } from ".";
import type { EmptyStateSize } from "./EmptyState.types";

const classes = {
    box: "w-[var(--overlay-width-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)] rounded-[var(--border-radius-medium)]",
    stack: "flex w-[var(--overlay-width-medium)] flex-col gap-[var(--base-size-16)]",
    // A panel that holds a list, so the message can be seen standing where the list would
    panel: "flex w-[var(--overlay-width-small)] flex-col overflow-hidden border-solid border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)] rounded-[var(--border-radius-medium)]",
    panelHeader:
        "p-[var(--base-size-8)] border-solid border-b-[length:var(--border-width-thin)] border-b-[color:var(--border-color-default)] [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)]",
};

const sizes: EmptyStateSize[] = ["small", "medium"];

export default {
    title: "Components/EmptyState/Features",
    parameters: {
        layout: "centered",
    },
};

// Sizes, which set the type and the icon. The small one is for a message standing inside a
// list or a menu; the medium one for a panel or a card
export const Sizes: StoryFn<typeof EmptyState> = () => (
    <div className={classes.stack}>
        {sizes.map((size) => (
            <div key={size} className={classes.box}>
                <EmptyState
                    size={size}
                    icon={SearchRegular}
                    title="No results found"
                    description="Try a different search term"
                />
            </div>
        ))}
    </div>
);

// Title Only, for somewhere there is nothing more worth saying
export const TitleOnly: StoryFn<typeof EmptyState> = () => (
    <div className={classes.box}>
        <EmptyState title="No results found" />
    </div>
);

// Without An Icon, for a message that has to keep to as little room as possible
export const WithoutIcon: StoryFn<typeof EmptyState> = () => (
    <div className={classes.box}>
        <EmptyState title="No results found" description="Try a different search term" />
    </div>
);

// With Actions, which say what can be done about it
export const WithActions: StoryFn<typeof EmptyState> = () => (
    <div className={classes.box}>
        <EmptyState
            icon={FilterDismissRegular}
            title="No issues match these filters"
            description="Clear the filters you have set, or widen them"
            actions={
                <>
                    <Button variant="primary">Clear filters</Button>
                    <Button>Edit filters</Button>
                </>
            }
        />
    </div>
);

// With A Link In The Description, for a message that points somewhere rather than acting
export const WithLink: StoryFn<typeof EmptyState> = () => (
    <div className={classes.box}>
        <EmptyState
            icon={DocumentRegular}
            title="No documents yet"
            description={
                <>
                    Read about <Link href="#documents">how documents work</Link> to get started
                </>
            }
        />
    </div>
);

// Standing In Place Of A List, which is what the message is there for
export const InPlaceOfAList: StoryFn<typeof EmptyState> = () => (
    <div className={classes.stack}>
        <div className={classes.panel}>
            <div className={classes.panelHeader}>Labels</div>
            <ActionList>
                <ActionList.Item>bug</ActionList.Item>
                <ActionList.Item>enhancement</ActionList.Item>
            </ActionList>
        </div>

        <div className={classes.panel}>
            <div className={classes.panelHeader}>Labels</div>
            <EmptyState
                size="small"
                icon={SearchRegular}
                title="No labels found"
                description="Try a different search term"
            />
        </div>
    </div>
);

// Holding Something Of The Caller's Own, which stands between the message and the actions
export const WithCustomContent: StoryFn<typeof EmptyState> = () => (
    <div className={classes.box}>
        <EmptyState
            icon={FolderRegular}
            title="This folder is empty"
            actions={<Button variant="primary">Upload a file</Button>}
        >
            <Link href="#import">Import from somewhere else</Link>
        </EmptyState>
    </div>
);
