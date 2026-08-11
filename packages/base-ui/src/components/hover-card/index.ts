import HoverCardBase from "./HoverCard";
import HoverCardContent from "./HoverCardContent";
import HoverCardTrigger from "./HoverCardTrigger";

export const HoverCard = Object.assign(HoverCardBase, {
    Trigger: HoverCardTrigger,
    Content: HoverCardContent,
});

export { HoverCardTrigger, HoverCardContent };
export { HoverCardContext } from "./HoverCardContext";
export * from "./HoverCard.types";
