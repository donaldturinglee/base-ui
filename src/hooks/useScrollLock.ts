import { useEffect } from "react";

// How many layers are holding the page still, so the last one to close is the one that hands
// it back
let lockCount = 0;
let restoreOverflow = "";
let restorePaddingRight = "";

// Holds the page still for as long as the layer is mounted, so that reaching the end of an
// overlay does not carry on scrolling the page behind it
export const useScrollLock = (disabled?: boolean) => {
    useEffect(() => {
        if (disabled) {
            return;
        }

        lockCount++;

        if (lockCount === 1) {
            // The bar the page loses is given back as padding, so nothing behind the overlay
            // shifts sideways as it opens
            const scrollbarWidth = window.innerWidth - document.body.clientWidth;

            restoreOverflow = document.body.style.overflow;
            restorePaddingRight = document.body.style.paddingRight;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.setAttribute("data-scroll-locked", "");
        }

        return () => {
            lockCount--;

            if (lockCount === 0) {
                document.body.style.overflow = restoreOverflow;
                document.body.style.paddingRight = restorePaddingRight;
                document.body.removeAttribute("data-scroll-locked");
            }
        };
    }, [disabled]);
};
