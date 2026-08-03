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
    root: "select-panel-header",
    content: "select-panel-header-content",
    contentWithSearchInput: "select-panel-header-content-with-search",
    titleRow: "select-panel-header-title-row",
    title: "select-panel-header-title",
    heading: "select-panel-header-heading",
    description: "select-panel-header-description",
    actions: "select-panel-header-actions",
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
