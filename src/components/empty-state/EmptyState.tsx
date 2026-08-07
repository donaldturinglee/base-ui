import * as React from "react";
import { isValidElementType } from "react-is";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { EmptyStateProps, EmptyStateSize, EmptyStateVisual } from "./EmptyState.types";

const emptyStateVariants = cva("empty-state", {
    variants: {
        size: {
            small: "empty-state-small",
            medium: "empty-state-medium",
        } satisfies Record<EmptyStateSize, string>,
    },
});

const classes = {
    icon: "empty-state-icon",
    title: "empty-state-title",
    description: "empty-state-description",
    actions: "empty-state-actions",
};

// Anything that can stand as a component is called with no props of its own, which covers a
// plain function, a memo and a forwarded ref alike; everything else is already built
const renderVisual = (visual: EmptyStateVisual): React.ReactNode => {
    if (typeof visual === "string" || !isValidElementType(visual)) {
        return visual as React.ReactNode;
    }

    const Visual = visual;

    return <Visual />;
};

// What a box that came back with nothing shows in place of what it would have held: a list
// with no items left after a filter, a panel nothing has been added to yet. A whole page that
// a reader has not started using is a Blankslate instead, which is drawn at that scale and
// carries a heading of its own
function EmptyState<As extends React.ElementType = "div">(
    props: EmptyStateProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        children,
        title,
        description,
        icon,
        size = "medium",
        actions,
        ...rest
    } = props as EmptyStateProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(emptyStateVariants({ size }), className)}
            data-component="EmptyState"
            data-size={size}
            {...rest}
        >
            {icon === undefined ? null : (
                <span className={classes.icon} aria-hidden="true" data-component="EmptyState.Icon">
                    {renderVisual(icon)}
                </span>
            )}

            <span className={classes.title} data-component="EmptyState.Title">
                {title}
            </span>

            {description ? (
                <span className={classes.description} data-component="EmptyState.Description">
                    {description}
                </span>
            ) : null}

            {children}

            {actions ? (
                <div className={classes.actions} data-component="EmptyState.Actions">
                    {actions}
                </div>
            ) : null}
        </Component>
    );
}

EmptyState.displayName = "EmptyState";

export default fixedForwardRef(EmptyState);
