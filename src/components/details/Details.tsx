import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DetailsProps } from "./Details.types";

const classes = {
    // The marker the browser draws beside the summary is taken away, so that whatever the
    // summary is made of is all there is to see
    root: "[&>summary]:list-none [&>summary::-webkit-details-marker]:hidden",
};

// A disclosure: a summary that is always there, and content that is only there once the
// summary has been used
function Details(
    props: DetailsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, open, defaultOpen, closeOnOutsideClick, onChange, onToggle, ...rest } =
        props;

    const detailsRef = React.useRef<HTMLDetailsElement>(null);
    const mergedRef = useMergedRefs(ref, detailsRef);

    // A disclosure the caller is holding the state of takes whether it is open from the prop;
    // one that is not keeps its own
    const isControlled = open !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(Boolean(defaultOpen));
    const isOpen = isControlled ? open : selfOpen;

    // The browser is what opens and closes the element, so the state follows what it did
    const handleToggle = (event: React.ToggleEvent<HTMLDetailsElement>) => {
        onToggle?.(event);

        const { open: isNowOpen } = event.currentTarget;

        // Followed either way, so that a controlled disclosure the caller has left as it was
        // is still rendered again and put back below
        setSelfOpen(isNowOpen);

        if (isNowOpen !== isOpen) {
            onChange?.(isNowOpen);
        }
    };

    // Where the caller is holding the state, the element is put back to whatever they last
    // asked for. Every render is checked, since the element having been opened behind React's
    // back is the one case this is here for
    React.useEffect(() => {
        const details = detailsRef.current;

        if (details && details.open !== isOpen) {
            details.open = isOpen;
        }
    });

    // A click anywhere else closes the disclosure again, which is what one standing over the
    // page rather than in it needs
    React.useEffect(() => {
        if (!closeOnOutsideClick || !isOpen) {
            return;
        }

        const handleClick = (event: MouseEvent) => {
            const { target } = event;

            // Everything the disclosure holds is left alone, including the summary that
            // closes it on its own
            if (!(target instanceof Element) || target.closest("details") === detailsRef.current) {
                return;
            }

            setSelfOpen(false);
            onChange?.(false);
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [closeOnOutsideClick, isOpen, onChange]);

    return (
        <details
            ref={mergedRef}
            open={isOpen}
            onToggle={handleToggle}
            className={classNames(classes.root, className)}
            data-component="Details"
            {...rest}
        />
    );
}

Details.displayName = "Details";

export default fixedForwardRef(Details);
