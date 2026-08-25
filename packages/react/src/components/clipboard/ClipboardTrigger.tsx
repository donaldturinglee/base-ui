import * as React from "react";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { ClipboardContext } from "./ClipboardContext";
import ClipboardIndicator from "./ClipboardIndicator";
import type { ClipboardTriggerProps } from "./Clipboard.types";

const classes = {
    root: "clipboard-trigger",
};

// What puts the value on the clipboard. Given nothing to say it is drawn as an icon button, and
// given words it is drawn as an ordinary button with the indicator standing before them.
//
// An indicator written out inside the trigger is taken as the one to carry, so a caller who wants
// icons of their own says so where the reference libraries say it. One that is not written out is
// handed the default, so the plainest trigger there is still reports what it has just done.
//
// The name it carries says what pressing it does, and goes on saying it after the value has been
// taken: pressing a copy button a second time copies a second time, and a button that renamed
// itself for what it had just done would be offering something it does not do
function ClipboardTrigger(
    props: ClipboardTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, label = "Copy", disabled, onClick, ...rest } = props;
    const { copied, disabled: isDisabled, copy } = React.useContext(ClipboardContext);

    const [slots, content] = useSlots(children, { indicator: ClipboardIndicator });
    const indicator = slots.indicator ?? <ClipboardIndicator />;
    // Whatever is left once the indicator has been taken out is what names the button, and a
    // trigger left holding nothing at all is the icon-only one
    const hasLabel = content.some(
        (child) => child !== null && child !== undefined && child !== false,
    );

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
        "data-component": "Clipboard.Trigger",
        "data-copied": Boolean(copied),
        ...rest,
    };

    if (hasLabel) {
        return (
            <Button ref={ref} leadingVisual={indicator} {...shared}>
                {content}
            </Button>
        );
    }

    return <IconButton ref={ref} icon={indicator} aria-label={label} {...shared} />;
}

ClipboardTrigger.displayName = "Clipboard.Trigger";

export default fixedForwardRef(ClipboardTrigger);
