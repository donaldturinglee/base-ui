import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { SelectPanelContext } from "./SelectPanelContext";
import type { SelectPanelFooterProps } from "./SelectPanel.types";

const classes = {
    root: "select-panel-footer",
    rootWithoutActions: "select-panel-footer-without-actions",
    content: "select-panel-footer-content",
    contentWithoutActions: "select-panel-footer-content-without-actions",
    actions: "select-panel-footer-actions",
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
