import { useContext } from "react";
import { PresenceContext } from "./PresenceContext";
import type { PresenceContextValue } from "./Presence.types";

// Where the content around a part stands. Standing outside of anything that manages presence
// is a mistake worth stopping at rather than carrying on from: the part cannot know whether it
// is meant to be drawn
export const usePresenceContext = (): PresenceContextValue => {
    const context = useContext(PresenceContext);

    if (!context) {
        throw new Error(
            "`usePresenceContext` has to be called within a `PresenceContext.Provider`.",
        );
    }

    return context;
};
