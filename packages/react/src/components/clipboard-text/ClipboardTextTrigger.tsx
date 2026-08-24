import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { ClipboardTextContext } from "./ClipboardTextContext";
import ClipboardTextIndicator from "./ClipboardTextIndicator";
import type { ClipboardTextTriggerProps } from "./ClipboardText.types";

const classes = {
    root: "clipboard-text-trigger",
};

// What puts the value on the clipboard. Given nothing to say it is drawn as an icon button, and
// given children it is drawn as an ordinary button with the indicator standing before them.
//
// The name it carries says what pressing it does, and goes on saying it after the value has been
// taken: pressing a copy button a second time copies a second time, and a button that renamed
// itself for what it had just done would be offering something it does not do
function ClipboardTextTrigger(
    props: ClipboardTextTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, label = "Copy", disabled, onClick, ...rest } = props;
    const { copied, disabled: isDisabled, copy } = React.useContext(ClipboardTextContext);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it
        if (event.defaultPrevented) {
            return;
        }

        copy?.();
    };

    const shared = {
        disabled: disabled ?? isDisabled,
        onClick: handleClick,
        className: classNames(classes.root, className),
        "data-component": "ClipboardText.Trigger",
        "data-copied": Boolean(copied),
        ...rest,
    };

    if (children) {
        return (
            <Button ref={ref} leadingVisual={<ClipboardTextIndicator />} {...shared}>
                {children}
            </Button>
        );
    }

    return (
        <IconButton ref={ref} icon={<ClipboardTextIndicator />} aria-label={label} {...shared} />
    );
}

ClipboardTextTrigger.displayName = "ClipboardText.Trigger";

export default fixedForwardRef(ClipboardTextTrigger);
