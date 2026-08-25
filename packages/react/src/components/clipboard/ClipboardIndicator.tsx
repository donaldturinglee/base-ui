import * as React from "react";
import { CheckmarkRegular, CopyRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ClipboardContext } from "./ClipboardContext";
import type { ClipboardIndicatorProps } from "./Clipboard.types";

const classes = {
    root: "clipboard-indicator",
    copied: "clipboard-indicator-copied",
};

// What the trigger carries: two sheets while there is something to copy, and a tick for as long
// as it has just been copied. A caller who would rather draw either of them themselves puts the
// waiting one in as children and the copied one in `copied`; one who says nothing is handed both.
//
// It is hidden from a screen reader, since the trigger already carries a name and the tick is
// said through the live region the clipboard holds
function ClipboardIndicator<As extends React.ElementType = "span">(
    props: ClipboardIndicatorProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        children,
        copied,
        ...rest
    } = props as ClipboardIndicatorProps<"span">;
    const { copied: isCopied } = React.useContext(ClipboardContext);

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, isCopied && classes.copied, className)}
            aria-hidden="true"
            data-component="Clipboard.Indicator"
            data-copied={Boolean(isCopied)}
            {...rest}
        >
            {isCopied ? (copied ?? <CheckmarkRegular />) : (children ?? <CopyRegular />)}
        </Component>
    );
}

ClipboardIndicator.displayName = "Clipboard.Indicator";

export default fixedForwardRef(ClipboardIndicator);
