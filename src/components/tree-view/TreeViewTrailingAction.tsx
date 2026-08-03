import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Tooltip } from "../tooltip";
import { TreeViewItemContext } from "./TreeViewContext";
import type { TreeViewTrailingActionProps } from "./TreeView.types";

const classes = {
    // Stands at the end of the row, in the column left over once everything else has been
    // given its width
    root: "flex [grid-column:5] text-foreground-muted",
    button: "shrink",
    hidden: "sr-only",
};

// The things an item can do beyond being picked, standing at the end of its row. They are
// kept out of the tab order: the row is the one stop, and the keyboard reaches the actions
// through a shortcut instead, so that a tree of a thousand rows is not a thousand tab stops
function TreeViewTrailingAction(props: TreeViewTrailingActionProps) {
    const { items, shortcutText } = props;
    const { itemId, trailingActionId } = React.useContext(TreeViewItemContext);

    // Focus goes back to the row, since an action that has been used is not somewhere to
    // stay and the tree moves by rows
    const returnFocus = () => {
        document.getElementById(itemId)?.focus();
    };

    return (
        <>
            <span id={trailingActionId} className={classes.hidden}>
                {shortcutText}
            </span>
            <span
                className={classes.root}
                aria-hidden="true"
                // Held here so that reaching for an action is not read as moving through
                // the tree
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                data-component="TreeView.TrailingAction"
            >
                {items.map(({ label, onClick, icon, count, className }, index) =>
                    // A count needs a label beside it, which only the full button draws
                    count ? (
                        <Tooltip key={index} text={label}>
                            <Button
                                variant="invisible"
                                leadingVisual={icon}
                                count={count}
                                aria-label={label}
                                aria-hidden="true"
                                tabIndex={-1}
                                onClick={onClick}
                                onKeyDown={returnFocus}
                                className={classNames(classes.button, className)}
                            />
                        </Tooltip>
                    ) : (
                        <IconButton
                            key={index}
                            icon={icon}
                            variant="invisible"
                            aria-label={label}
                            aria-hidden="true"
                            tabIndex={-1}
                            onClick={onClick}
                            onKeyDown={returnFocus}
                            className={classNames(classes.button, className)}
                        />
                    ),
                )}
            </span>
        </>
    );
}

TreeViewTrailingAction.displayName = "TreeView.TrailingAction";

export default TreeViewTrailingAction;
