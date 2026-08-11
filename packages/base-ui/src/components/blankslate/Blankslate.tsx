import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateProps, BlankslateSize } from "./Blankslate.types";

const classes = {
    container: "blankslate-container",
    root: "blankslate",
    border: "blankslate-border",
    narrow: "blankslate-narrow",
    size: {
        small: "blankslate-small",
        medium: "blankslate-medium",
        large: "blankslate-large",
    } satisfies Record<BlankslateSize, string>,
    padding: {
        small: "blankslate-padding-small",
        medium: "blankslate-padding-medium",
        large: "blankslate-padding-large",
    } satisfies Record<BlankslateSize, string>,
    spaciousPadding: {
        small: "blankslate-padding-spacious-small",
        medium: "blankslate-padding-spacious-medium",
        large: "blankslate-padding-spacious-large",
    } satisfies Record<BlankslateSize, string>,
    tightType: "blankslate-tight-type",
    tightPadding: {
        small: "blankslate-tight-padding-small",
        medium: "blankslate-tight-padding-medium",
        large: "blankslate-tight-padding-large",
    } satisfies Record<BlankslateSize, string>,
    tightSpaciousPadding: "blankslate-tight-padding-spacious",
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
