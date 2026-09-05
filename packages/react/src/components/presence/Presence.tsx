import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { splitPresenceProps } from "./splitPresenceProps";
import { usePresence } from "./usePresence";
import type { PresenceProps } from "./Presence.types";

// React 19.2 brought `Activity`, which keeps hidden content mounted with its effects paused.
// It is looked for rather than counted on, since the library also runs on a React without it
const Activity = (React as Partial<typeof React>).Activity;

// Something that is there, or not, and animates between the two. It is asked whether its
// content is present and answers by drawing it, hiding it, or taking it off the page; where the
// stylesheet animates the content out, it waits for that to run before the content goes. What
// it is drawn from is written onto it as `data-state`, which is what a stylesheet animates by
function Presence<As extends React.ElementType = "div">(
    props: PresenceProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const [presenceProps, localProps] = splitPresenceProps(props as PresenceProps<"div">);
    const { as: Component = "div", className, ...rest } = localProps;

    const presence = usePresence(presenceProps);
    const mergedRef = useMergedRefs(ref, presence.ref);

    if (presence.unmounted) {
        return null;
    }

    const element = (
        <Component
            ref={mergedRef}
            // The presence draws nothing of its own, so there is no class of its own to merge
            // the caller's with
            className={className}
            data-component="Presence"
            {...rest}
            // Whether the content is hidden is the presence's to say, so what it says comes
            // after whatever the caller passed
            {...presence.getPresenceProps()}
        />
    );

    // Content held by React keeps its effects paused while it is hidden, which is what a
    // caller asking for it wants and what only React can do
    if (presence.hideMode === "activity" && Activity) {
        return <Activity mode={presence.present ? "visible" : "hidden"}>{element}</Activity>;
    }

    return element;
}

Presence.displayName = "Presence";

export default fixedForwardRef(Presence);
