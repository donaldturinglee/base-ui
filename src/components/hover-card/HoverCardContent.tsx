import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { HoverCardContentProps } from "./HoverCard.types";

const classes = {
    root: "hover-card-content",
};

// What the card has to say. It is laid out inside the surface rather than being the surface
// itself, so that the padding the words sit in is the caller's to change without disturbing
// where the card stands
function HoverCardContent(
    props: HoverCardContentProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="HoverCard.Content"
            {...rest}
        />
    );
}

HoverCardContent.displayName = "HoverCard.Content";

export default fixedForwardRef(HoverCardContent);
