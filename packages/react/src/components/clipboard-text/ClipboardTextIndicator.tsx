import * as React from "react";
import { CheckmarkRegular, CopyRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ClipboardTextContext } from "./ClipboardTextContext";
import type { ClipboardTextIndicatorProps } from "./ClipboardText.types";

const classes = {
    copied: "clipboard-text-indicator-copied",
};

// The icon the trigger carries: two sheets while there is something to copy, and a tick for as
// long as it has just been copied. It is hidden from a screen reader, since the trigger already
// carries a name and the tick is said through the live region the clipboard holds
function ClipboardTextIndicator(
    props: ClipboardTextIndicatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, copyIcon = CopyRegular, copiedIcon = CheckmarkRegular, ...rest } = props;
    const { copied } = React.useContext(ClipboardTextContext);

    const Icon = copied ? copiedIcon : copyIcon;

    return (
        <Icon
            ref={ref}
            className={classNames(copied && classes.copied, className)}
            aria-hidden="true"
            data-component="ClipboardText.Indicator"
            data-copied={Boolean(copied)}
            {...rest}
        />
    );
}

ClipboardTextIndicator.displayName = "ClipboardText.Indicator";

export default fixedForwardRef(ClipboardTextIndicator);
