import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { StatusContext } from "./StatusContext";
import type { StatusProps, StatusSize, StatusVariant } from "./Status.types";

const classes = {
    srOnly: "sr-only",
};

const statusVariants = cva("status", {
    variants: {
        variant: {
            accent: "status-accent",
            success: "status-success",
            attention: "status-attention",
            severe: "status-severe",
            danger: "status-danger",
            done: "status-done",
            neutral: "status-neutral",
        } satisfies Record<StatusVariant, string>,
        size: {
            small: "status-small",
            medium: "status-medium",
            large: "status-large",
        } satisfies Record<StatusSize, string>,
    },
});

// The condition a thing is in, laid out as a row of parts the caller names rather than parts
// drawn here:
//
//     <Status variant="success">
//         <Status.Indicator />
//         Operational
//     </Status>
//
// so what is read is what was written, in the order it was written. The colour and the size are
// answered once here and taken from context by the dot, so the two stay in step without being
// named twice
//
// The words are left in the ordinary foreground rather than tinted to match: the colour is what
// draws the eye down a column of these, and the words are what say which one it stopped at.
// Where a row carries no words, srText gives it the ones a screen reader would otherwise miss
function Status<As extends React.ElementType = "span">(
    props: StatusProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        variant = "neutral",
        size = "medium",
        srText,
        children,
        ...rest
    } = props as StatusProps<"span">;

    return (
        <StatusContext.Provider value={{ variant, size }}>
            <Component
                ref={ref}
                className={classNames(statusVariants({ variant, size }), className)}
                data-component="Status"
                data-variant={variant}
                data-size={size}
                {...rest}
            >
                {srText ? <span className={classes.srOnly}>{srText}</span> : null}
                {children}
            </Component>
        </StatusContext.Provider>
    );
}

Status.displayName = "Status";

export default fixedForwardRef(Status);
