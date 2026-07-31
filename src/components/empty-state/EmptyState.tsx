import * as React from "react";
import { isValidElementType } from "react-is";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { EmptyStateProps, EmptyStateSize, EmptyStateVisual } from "./EmptyState.types";

const classes = {
    root: "flex flex-col items-center justify-center text-center [color:var(--foreground-color-default)]",
    size: {
        small: "gap-[var(--base-size-4)] p-[var(--base-size-16)] [--empty-state-icon-size:var(--base-size-20)] [--empty-state-title-size:var(--text-body-size-medium)] [--empty-state-description-size:var(--text-body-size-small)]",
        medium: "gap-[var(--base-size-8)] p-[var(--base-size-24)] [--empty-state-icon-size:var(--base-size-24)] [--empty-state-title-size:var(--text-title-size-small)] [--empty-state-description-size:var(--text-body-size-medium)]",
    } satisfies Record<EmptyStateSize, string>,
    icon: "flex items-center justify-center [color:var(--foreground-color-muted)] [&>svg]:size-[var(--empty-state-icon-size)]",
    title: "m-0 [font-size:var(--empty-state-title-size)] [font-weight:var(--base-text-weight-semibold)] [line-height:var(--text-body-line-height-medium)]",
    description:
        "m-0 [font-size:var(--empty-state-description-size)] [line-height:var(--text-body-line-height-medium)] [color:var(--foreground-color-muted)]",
    actions:
        "flex flex-wrap items-center justify-center gap-[var(--base-size-8)] mt-[var(--base-size-4)]",
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
            className={classNames(classes.root, classes.size[size], className)}
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
