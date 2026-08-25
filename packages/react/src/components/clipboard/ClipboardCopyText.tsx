import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ClipboardContext } from "./ClipboardContext";
import type { ClipboardCopyTextProps } from "./Clipboard.types";

const classes = {
    root: "clipboard-copy-text",
    hidden: "sr-only",
};

// The words beside the indicator, for a trigger that carries more than an icon: what pressing it
// does while there is something to copy, and what it did for as long as the tick stands.
//
// Unlike the indicator these are left to a screen reader, so a trigger holding nothing else is
// named by them, and that name follows what has just happened. That makes them the other way of
// reporting a copy, and a row is only to report it once: a clipboard whose trigger says so in
// words is the one that turns its own announcement off with `copiedAnnouncement={null}`
function ClipboardCopyText<As extends React.ElementType = "span">(
    props: ClipboardCopyTextProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        children = "Copy",
        copied = "Copied",
        visuallyHidden,
        ...rest
    } = props as ClipboardCopyTextProps<"span">;
    const { copied: isCopied } = React.useContext(ClipboardContext);

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, visuallyHidden && classes.hidden, className)}
            data-component="Clipboard.CopyText"
            data-copied={Boolean(isCopied)}
            {...rest}
        >
            {isCopied ? copied : children}
        </Component>
    );
}

ClipboardCopyText.displayName = "Clipboard.CopyText";

export default fixedForwardRef(ClipboardCopyText);
