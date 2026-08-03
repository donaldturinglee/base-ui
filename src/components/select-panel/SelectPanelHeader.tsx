import * as React from "react";
import {
    ArrowLeftRegular,
    DismissRegular,
    FilterDismissRegular,
} from "@gamecrafters/base-ui-icons";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Heading } from "../heading";
import { IconButton } from "../icon-button";
import { SelectPanelContext } from "./SelectPanelContext";
import SelectPanelSearchInput from "./SelectPanelSearchInput";
import type { SelectPanelHeaderProps } from "./SelectPanel.types";

const classes = {
    root: "flex shrink-0 flex-col p-[var(--base-size-8)] border-solid border-b-[length:var(--border-width-thin)] border-b-border-default",
    // The title and the buttons stand either end of the row. A description puts a second line
    // under the title, so the buttons keep to the top rather than centring against both
    content: "flex items-center justify-between data-[has-description]:items-start",
    contentWithSearchInput: "mb-[var(--base-size-8)]",
    titleRow: "flex",
    title: "ms-[var(--base-size-8)] data-[has-description]:mt-[var(--base-size-2)] data-[has-back]:ms-[var(--base-size-4)]",
    heading:
        "[font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)]",
    description: "block [font-size:var(--text-body-size-small)] text-foreground-muted",
    actions: "flex",
};

const slotsConfig = {
    searchInput: SelectPanelSearchInput,
};

// Names the panel and holds the buttons that dismiss it. A panel with no header of its own is
// given this one, so that there is always something to close it by
function SelectPanelHeader(
    props: SelectPanelHeaderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, onBack, ...rest } = props;

    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);
    const { panelId, title, description, onCancel, onClearSelection } =
        React.useContext(SelectPanelContext);

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="SelectPanel.Header"
            {...rest}
        >
            <div
                className={classNames(
                    classes.content,
                    slots.searchInput && classes.contentWithSearchInput,
                )}
                data-has-description={description ? "" : undefined}
                data-has-search-input={slots.searchInput ? "" : undefined}
            >
                <div className={classes.titleRow}>
                    {onBack ? (
                        <IconButton
                            type="button"
                            variant="invisible"
                            icon={ArrowLeftRegular}
                            aria-label="Back"
                            onClick={onBack}
                            data-component="SelectPanel.BackButton"
                        />
                    ) : null}

                    <div
                        className={classes.title}
                        data-has-description={description ? "" : undefined}
                        data-has-back={onBack ? "" : undefined}
                    >
                        {/* The level is not the caller's to set: a panel is read on its own,
                            so its title is the first heading within it either way */}
                        <Heading
                            as="h1"
                            id={panelId ? `${panelId}-title` : undefined}
                            className={classes.heading}
                        >
                            {title}
                        </Heading>
                        {description ? (
                            <span
                                id={panelId ? `${panelId}-description` : undefined}
                                className={classes.description}
                            >
                                {description}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className={classes.actions}>
                    {onClearSelection ? (
                        <IconButton
                            type="button"
                            variant="invisible"
                            icon={FilterDismissRegular}
                            aria-label="Clear selection"
                            onClick={onClearSelection}
                            data-component="SelectPanel.ClearSelectionButton"
                        />
                    ) : null}
                    <IconButton
                        type="button"
                        variant="invisible"
                        icon={DismissRegular}
                        aria-label="Close"
                        onClick={onCancel}
                        data-component="SelectPanel.CloseButton"
                    />
                </div>
            </div>

            {slots.searchInput}
            {childrenWithoutSlots}
        </div>
    );
}

SelectPanelHeader.displayName = "SelectPanel.Header";

export default fixedForwardRef(SelectPanelHeader);
