import * as React from "react";
import { copyText } from "./copyText";
import type { UseClipboardProps, UseClipboardReturn } from "./Clipboard.types";

// How long the tick stands before the trigger goes back to offering a copy. Long enough to be
// seen by a reader who was looking somewhere else as they pressed, short enough that a second
// copy is not left looking like the first one
export const DEFAULT_TIMEOUT = 3000;

// Everything a copy control needs and nothing that draws one: the text it holds, whether that has
// just been taken, and the way to take it. The clipboard is built on this, so a caller who wants
// a control of their own rather than the parts is working from the same state the parts are.
//
//     const clipboard = useClipboard({ value: url });
//
//     <Button onClick={clipboard.copy}>{clipboard.copied ? "Copied" : "Copy"}</Button>
export const useClipboard = (props: UseClipboardProps = {}): UseClipboardReturn => {
    const {
        value,
        defaultValue,
        timeout = DEFAULT_TIMEOUT,
        disabled,
        onValueChange,
        onStatusChange,
        onCopyError,
    } = props;

    // A caller holding the value takes it from the prop; one that is not leaves the hook holding
    // it instead
    const isControlled = value !== undefined;
    const [selfValue, setSelfValue] = React.useState(defaultValue ?? "");
    const currentValue = isControlled ? value : selfValue;

    // The copies are counted rather than simply noted, so that copying again while the tick is
    // still standing starts the wait over instead of being timed out by the copy before it
    const [copies, setCopies] = React.useState(0);
    const isCopied = copies > 0;

    // The tick is taken away on a timer, and a handler written fresh each render would otherwise
    // set that timer up again on every pass; the latest one is held aside instead
    const onStatusChangeRef = React.useRef(onStatusChange);

    React.useEffect(() => {
        onStatusChangeRef.current = onStatusChange;
    }, [onStatusChange]);

    React.useEffect(() => {
        if (copies === 0 || timeout <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setCopies(0);
            onStatusChangeRef.current?.(false);
        }, timeout);

        return () => {
            window.clearTimeout(timer);
        };
    }, [copies, timeout]);

    const setValue = (next: string) => {
        if (!isControlled) {
            setSelfValue(next);
        }

        onValueChange?.(next);
    };

    const copy = () => {
        if (disabled) {
            return;
        }

        void copyText(currentValue).then(
            () => {
                setCopies((count) => count + 1);
                onStatusChange?.(true);
            },
            (error: unknown) => {
                onCopyError?.(error);
            },
        );
    };

    return {
        value: currentValue,
        copied: isCopied,
        disabled: Boolean(disabled),
        copy,
        setValue,
    };
};
