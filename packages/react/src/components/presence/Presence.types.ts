import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// How content that is drawn but not present is kept out of sight. `display-none` takes it off
// the page and leaves its effects running; `activity` hands it to React to hold with its
// effects paused, which needs a React that has `Activity` to hand it to
export type PresenceHideMode = "display-none" | "activity";

// Where the content stands: on the page, on its way off it while its exit animation runs, or
// off it altogether
export type PresenceState = "mounted" | "unmountSuspended" | "unmounted";

export type UsePresenceOptions = {
    // Whether the content is meant to be there. The content itself lags behind by the length
    // of whatever animation it leaves with
    present?: boolean;
    // Leaves the content off the page until it is first present, rather than drawing it hidden
    lazyMount?: boolean;
    // Takes the content off the page once it has left, rather than leaving it there hidden
    unmountOnExit?: boolean;
    hideMode?: PresenceHideMode;
    // Leaves the state an animation runs from off the content until its presence has changed
    // once, so content that starts out present is drawn in place rather than animated in
    skipAnimationOnMount?: boolean;
    // Called once the content has finished animating in. Content that starts out present has
    // nothing to animate in from, so it is not called for that
    onEnterComplete?: () => void;
    // Called once the content has finished animating out, which is when it leaves the page
    onExitComplete?: () => void;
};

// What the element the presence is about is drawn with
export type PresenceAttributes = {
    "data-state"?: "open" | "closed";
    hidden: boolean;
};

export type UsePresenceReturn = {
    // Given to the element the presence is about, so that its animations can be watched
    ref: (node: HTMLElement | null) => void;
    getPresenceProps: () => PresenceAttributes;
    // Whether the content is on the page, which it still is while it is on its way off
    present: boolean;
    // Whether the content is off the page altogether, rather than on it hidden
    unmounted: boolean;
    // How hidden content is kept out of sight, once what React can do has been taken into
    // account
    hideMode: PresenceHideMode;
    // Whether the content is still as it was first drawn, so the animation it would start
    // with is the one that runs on mounting
    skip: boolean;
};

export type PresenceProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    UsePresenceOptions & {
        className?: string;
    }
>;

export type PresenceContextValue = UsePresenceReturn;
