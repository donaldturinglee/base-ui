import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { SelectPanelContext } from "./SelectPanelContext";
import type { SelectPanelFooterProps } from "./SelectPanel.types";

const classes = {
    root: "flex shrink-0 items-center justify-between min-h-[var(--base-size-44)] p-[var(--base-size-16)] border-solid border-t-[length:var(--border-width-thin)] border-t-[color:var(--border-color-default)]",
    // With nothing to save, the footer is only there to hold whatever the caller put in it, so
    // it is drawn in closer and that content is given the width
    rootWithoutActions: "p-[var(--base-size-8)]",
    content: "grow-0",
    contentWithoutActions: "grow",
    actions: "flex gap-[var(--stack-gap-condensed)]",
};

// Stands at the foot of the panel, where the selection is saved or given up. A panel that
// takes the first pick as its answer has nothing to save, so only what the caller put in the
// footer is drawn
function SelectPanelFooter(
    props: SelectPanelFooterProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;
    const { selectionVariant, onCancel } = React.useContext(SelectPanelContext);

    const hasActions = selectionVariant !== "instant";

    // Nothing to save and nothing of the caller's own leaves an empty bar
    if (!hasActions && !children) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={classNames(
                classes.root,
                !hasActions && classes.rootWithoutActions,
                className,
            )}
            data-component="SelectPanel.Footer"
            data-has-actions={hasActions ? "" : undefined}
            {...rest}
        >
            <div
                className={classNames(
                    classes.content,
                    !hasActions && classes.contentWithoutActions,
                )}
            >
                {children}
            </div>

            {hasActions ? (
                <div className={classes.actions}>
                    <Button type="button" size="small" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" size="small" variant="primary">
                        Save
                    </Button>
                </div>
            ) : null}
        </div>
    );
}

SelectPanelFooter.displayName = "SelectPanel.Footer";

export default fixedForwardRef(SelectPanelFooter);
