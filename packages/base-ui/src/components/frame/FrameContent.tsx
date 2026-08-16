import * as React from "react";
import type { FrameContentProps } from "./Frame.types";

// Stands inside the frame's own document and says when it was drawn there and when it was taken
// back out again. The callbacks are read from a ref rather than listed as dependencies, so a
// caller passing a fresh function on every render does not read as the frame having been drawn
// again
function FrameContent({ onMount, onUnmount, children }: FrameContentProps) {
    const latest = React.useRef({ onMount, onUnmount });

    React.useEffect(() => {
        latest.current = { onMount, onUnmount };
    }, [onMount, onUnmount]);

    React.useEffect(() => {
        latest.current.onMount?.();

        return () => {
            latest.current.onUnmount?.();
        };
    }, []);

    return <>{children}</>;
}

FrameContent.displayName = "Frame.Content";

export default FrameContent;
