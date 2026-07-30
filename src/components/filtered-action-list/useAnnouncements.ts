import * as React from "react";
import type {
    FilteredActionListItemInput,
    FilteredActionListMessageText,
} from "./FilteredActionList.types";

// The announcement is held back so that it queues behind whatever the reader is already
// being told about the field rather than cutting it off
const ANNOUNCEMENT_DELAY = 500;

export type AnnouncementsOptions = {
    items: FilteredActionListItemInput[];
    // Whether the list is announced at all, for a caller announcing it some other way
    enabled?: boolean;
    // A list that is still waiting has nothing to say yet, so an empty one is left alone
    loading?: boolean;
    // What is said in place of the count, where the filter has left the list with nothing
    messageText?: FilteredActionListMessageText;
};

// What a screen reader is told as the list is filtered. Focus never leaves the field while
// the items change underneath it, so nothing about the list would otherwise be read out
export const useAnnouncements = ({
    items,
    enabled = true,
    loading = false,
    messageText,
}: AnnouncementsOptions) => {
    const [announcement, setAnnouncement] = React.useState("");

    const count = items.length;
    const selectedCount = items.filter((item) => item.selected).length;
    const isEmpty = count === 0 && !loading;
    const emptyText = messageText ? `${messageText.title}. ${messageText.description}` : "";

    const text = isEmpty
        ? emptyText
        : `${count} item${count === 1 ? "" : "s"} available, ${selectedCount} selected.`;

    // Nothing is said about the list the reader has only just arrived at, since the field is
    // announced as it takes focus and would say the same thing twice over
    const announced = React.useRef(text);

    React.useEffect(() => {
        if (!enabled || text === announced.current) {
            return;
        }

        announced.current = text;

        const timeout = window.setTimeout(() => setAnnouncement(text), ANNOUNCEMENT_DELAY);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [enabled, text]);

    return enabled ? announcement : "";
};
