import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateProps, BlankslateSize } from "./Blankslate.types";

const classes = {
    // The blankslate responds to the room it is given rather than to the viewport, so the
    // wrapper is what the container queries below measure
    container: "@container/blankslate",
    root: "grid justify-items-center p-[var(--blankslate-padding)]",
    border: "border-solid border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]",
    narrow: "max-w-[485px] mx-auto",
    size: {
        small: "[--blankslate-heading-text:var(--text-title-shorthand-small)] [--blankslate-heading-margin-block:0_var(--base-size-4)] [--blankslate-description-text:var(--text-body-shorthand-medium)] [--blankslate-action-margin-block-end:var(--base-size-12)] [--blankslate-visual-size:var(--base-size-24)]",
        medium: "[--blankslate-heading-text:var(--text-title-shorthand-medium)] [--blankslate-heading-margin-block:0_var(--base-size-4)] [--blankslate-description-text:var(--text-body-shorthand-large)] [--blankslate-action-margin-block-end:var(--base-size-16)]",
        large: "[--blankslate-heading-text:var(--text-title-shorthand-large)] [--blankslate-heading-margin-block:var(--base-size-8)_var(--base-size-4)] [--blankslate-description-text:var(--text-body-shorthand-large)] [--blankslate-description-margin-block:0_var(--base-size-8)] [--blankslate-action-margin-block-end:var(--base-size-16)]",
    } satisfies Record<BlankslateSize, string>,
    padding: {
        small: "[--blankslate-padding:var(--base-size-16)]",
        medium: "[--blankslate-padding:var(--base-size-32)]",
        large: "[--blankslate-padding:var(--base-size-32)]",
    } satisfies Record<BlankslateSize, string>,
    spaciousPadding: {
        small: "[--blankslate-padding:var(--base-size-44)_var(--base-size-28)]",
        medium: "[--blankslate-padding:var(--base-size-80)_var(--base-size-40)]",
        large: "[--blankslate-padding:var(--base-size-80)_var(--base-size-40)]",
    } satisfies Record<BlankslateSize, string>,
    // In a narrow container the type drops to the small scale whatever the size prop says
    tightType:
        "@max-[34rem]/blankslate:[--blankslate-heading-text:var(--text-title-shorthand-small)] @max-[34rem]/blankslate:[--blankslate-description-text:var(--text-body-shorthand-medium)]",
    tightPadding: {
        small: "@max-[34rem]/blankslate:[--blankslate-padding:var(--base-size-16)]",
        medium: "@max-[34rem]/blankslate:[--blankslate-padding:var(--base-size-20)]",
        large: "@max-[34rem]/blankslate:[--blankslate-padding:var(--base-size-20)]",
    } satisfies Record<BlankslateSize, string>,
    tightSpaciousPadding:
        "@max-[34rem]/blankslate:[--blankslate-padding:var(--base-size-44)_var(--base-size-28)]",
};

function Blankslate<As extends React.ElementType = "div">(
    props: BlankslateProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        size = "medium",
        border,
        narrow,
        spacious,
        ...rest
    } = props as BlankslateProps<"div">;

    return (
        <div className={classes.container}>
            <Component
                ref={ref}
                className={classNames(
                    classes.root,
                    classes.size[size],
                    spacious ? classes.spaciousPadding[size] : classes.padding[size],
                    classes.tightType,
                    spacious ? classes.tightSpaciousPadding : classes.tightPadding[size],
                    border && classes.border,
                    narrow && classes.narrow,
                    className,
                )}
                data-component="Blankslate"
                data-size={size}
                data-border={border}
                data-narrow={narrow}
                data-spacious={spacious}
                {...rest}
            />
        </div>
    );
}

Blankslate.displayName = "Blankslate";

export default fixedForwardRef(Blankslate);
