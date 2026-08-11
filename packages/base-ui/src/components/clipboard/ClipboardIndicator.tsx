import * as React from "react";
import { CheckmarkRegular, CopyRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ClipboardContext } from "./ClipboardContext";
import type { ClipboardIndicatorProps } from "./Clipboard.types";

const classes = {
    copied: "clipboard-indicator-copied",
};

// The icon the trigger carries: two sheets while there is something to copy, and a tick for as
// long as it has just been copied. It is hidden from a screen reader, since the trigger already
// carries a name and the tick is said through the live region the clipboard holds
function ClipboardIndicator(
    props: ClipboardIndicatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, copyIcon = CopyRegular, copiedIcon = CheckmarkRegular, ...rest } = props;
    const { copied } = React.useContext(ClipboardContext);

    const Icon = copied ? copiedIcon : copyIcon;

    return (
        <Icon
            ref={ref}
            className={classNames(copied && classes.copied, className)}
            aria-hidden="true"
            data-component="Clipboard.Indicator"
            data-copied={Boolean(copied)}
            {...rest}
        />
    );
}

ClipboardIndicator.displayName = "Clipboard.Indicator";

export default fixedForwardRef(ClipboardIndicator);
