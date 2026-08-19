import type * as React from "react";

export type FrameProps = React.ComponentPropsWithoutRef<"iframe"> & {
    // Written into the frame's own head, for the stylesheets and the fonts whatever is drawn
    // inside it is to be read under. A frame carries none of the page's styles, so anything it
    // needs has to be handed to it here
    head?: React.ReactNode;
    // Called once the frame's document is there and the children have been drawn into it
    onMount?: () => void;
    // Called as the children are taken back out of it again
    onUnmount?: () => void;
    className?: string;
};

export type FrameContentProps = {
    onMount?: () => void;
    onUnmount?: () => void;
    children?: React.ReactNode;
};
