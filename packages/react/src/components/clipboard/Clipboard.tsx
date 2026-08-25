import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ClipboardContext } from "./ClipboardContext";
import { useClipboard } from "./useClipboard";
import type { ClipboardElementProps, ClipboardProps } from "./Clipboard.types";

const classes = {
    root: "clipboard",
    hidden: "sr-only",
};

// A value laid out to be taken away: a name for it, something showing what will be copied, and
// something to press to copy it.
//
//     <Clipboard value={url}>
//         <Clipboard.Label>Repository URL</Clipboard.Label>
//         <Clipboard.Control>
//             <Clipboard.Input />
//             <Clipboard.Trigger />
//         </Clipboard.Control>
//     </Clipboard>
//
// The value is named here rather than on the parts, so what is shown and what is copied cannot
// drift apart, and so a value with nowhere to show it can still be copied from a trigger standing
// on its own.
//
// The trigger is named for what pressing it does rather than for what it has just done, the way
// the password field's toggle is: a button that reports a state it will leave in a moment reads
// as contradicting itself the moment it does. What has happened is said twice over instead, once
// in the tick the indicator swaps to and once through the live region below, which is what a
// reader who cannot see the tick is told
function Clipboard<As extends React.ElementType = "div">(
    props: ClipboardProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        value,
        defaultValue,
        timeout,
        disabled,
        copiedAnnouncement = "Copied to clipboard",
        onValueChange,
        onStatusChange,
        onCopyError,
        children,
        ...rest
    } = props as unknown as ClipboardElementProps;

    const clipboard = useClipboard({
        value,
        defaultValue,
        timeout,
        disabled,
        onValueChange,
        onStatusChange,
        onCopyError,
    });

    // The field names itself, since it may have been given an id of its own or taken one from the
    // form control it stands in, and reports back what it settled on. Nothing is assumed here, so
    // a name standing over no field at all points at nothing rather than at something absent
    const [inputId, setInputId] = React.useState<string | undefined>(undefined);

    const context = {
        ...clipboard,
        inputId,
        setInputId,
    };

    return (
        <ClipboardContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="Clipboard"
                data-copied={clipboard.copied}
                data-disabled={clipboard.disabled}
                {...rest}
            >
                {children}

                {/* The tick is the only thing that says the value was taken, and a tick says
                    nothing to a reader who cannot see it. A row that reports the copy in words of
                    its own says so already, and turns this off rather than saying it twice */}
                {copiedAnnouncement === null ? null : (
                    <span
                        role="status"
                        aria-live="polite"
                        className={classes.hidden}
                        data-component="Clipboard.Announcement"
                    >
                        {clipboard.copied ? copiedAnnouncement : ""}
                    </span>
                )}
            </Component>
        </ClipboardContext.Provider>
    );
}

Clipboard.displayName = "Clipboard";

export default fixedForwardRef(Clipboard);
