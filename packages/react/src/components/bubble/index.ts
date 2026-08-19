import BubbleBase from "./Bubble";
import BubbleContent from "./BubbleContent";
import BubbleGroup from "./BubbleGroup";
import BubbleReactions from "./BubbleReactions";

export const Bubble = Object.assign(BubbleBase, {
    Group: BubbleGroup,
    Content: BubbleContent,
    Reactions: BubbleReactions,
});

export { BubbleGroup, BubbleContent, BubbleReactions };
export { BubbleContext } from "./BubbleContext";
export { BubbleGroupContext } from "./BubbleGroupContext";
export * from "./Bubble.types";
