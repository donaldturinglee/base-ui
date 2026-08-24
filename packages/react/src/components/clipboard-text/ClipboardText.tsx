import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ClipboardTextContext } from "./ClipboardTextContext";
import { copyText } from "./copyText";
import type { ClipboardTextElementProps, ClipboardTextProps } from "./ClipboardText.types";

const classes = {
    root: "clipboard-text",
    hidden: "sr-only",
};

// How long the tick stands before the trigger goes back to offering a copy. Long enough to be
// seen by a reader who was looking somewhere else as they pressed, short enough that a second
// copy is not left looking like the first one
const DEFAULT_TIMEOUT = 2000;

// A value laid out to be taken away: something showing what will be copied, and something to
// press to copy it.
//
//     <ClipboardText value={url}>
//         <ClipboardText.Input />
//         <ClipboardText.Trigger />
//     </ClipboardText>
//
// The value is named here rather than on the parts, so the field and the trigger cannot drift
// apart, and so a value with nowhere to show it can still be copied from a trigger standing on
// its own.
//
// The trigger is named for what pressing it does rather than for what it has just done, the way
// the password field's toggle is: a button that reports a state it will leave in a moment reads
// as contradicting itself the moment it does. What has happened is said twice over instead, once
// in the tick the indicator swaps to and once through the live region below, which is what a
// reader who cannot see the tick is told
function ClipboardText<As extends React.ElementType = "div">(
    props: ClipboardTextProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        value,
        timeout = DEFAULT_TIMEOUT,
        disabled,
        copiedAnnouncement = "Copied to clipboard",
        onCopy,
        onCopyError,
        children,
        ...rest
    } = props as unknown as ClipboardTextElementProps;

    const inputId = useId();

    // The copies are counted rather than simply noted, so that pressing again while the tick is
    // still standing starts the wait over instead of being timed out by the press before it
    const [copies, setCopies] = React.useState(0);
    const isCopied = copies > 0;

    React.useEffect(() => {
        if (copies === 0 || timeout <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setCopies(0);
        }, timeout);

        return () => {
            window.clearTimeout(timer);
        };
    }, [copies, timeout]);

    const copy = () => {
        if (disabled) {
            return;
        }

        void copyText(value).then(
            () => {
                setCopies((count) => count + 1);
                onCopy?.(value);
            },
            (error: unknown) => {
                onCopyError?.(error);
            },
        );
    };

    const context = {
        value,
        copied: isCopied,
        disabled: Boolean(disabled),
        copy,
        inputId,
    };

    return (
        <ClipboardTextContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="ClipboardText"
                data-copied={isCopied}
                data-disabled={Boolean(disabled)}
                {...rest}
            >
                {children}

                {/* The tick is the only thing that says the value was taken, and a tick says
                    nothing to a reader who cannot see it */}
                <span
                    role="status"
                    aria-live="polite"
                    className={classes.hidden}
                    data-component="ClipboardText.Announcement"
                >
                    {isCopied ? copiedAnnouncement : ""}
                </span>
            </Component>
        </ClipboardTextContext.Provider>
    );
}

ClipboardText.displayName = "ClipboardText";

export default fixedForwardRef(ClipboardText);
