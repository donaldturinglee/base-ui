import TimelineBase from "./Timeline";
import TimelineActions from "./TimelineActions";
import TimelineAvatar from "./TimelineAvatar";
import TimelineBadge from "./TimelineBadge";
import TimelineBody from "./TimelineBody";
import TimelineBreak from "./TimelineBreak";
import TimelineItem from "./TimelineItem";

export const Timeline = Object.assign(TimelineBase, {
    Item: TimelineItem,
    Avatar: TimelineAvatar,
    Badge: TimelineBadge,
    Body: TimelineBody,
    Break: TimelineBreak,
    Actions: TimelineActions,
});

export {
    TimelineItem,
    TimelineAvatar,
    TimelineBadge,
    TimelineBody,
    TimelineBreak,
    TimelineActions,
};
export * from "./Timeline.types";
