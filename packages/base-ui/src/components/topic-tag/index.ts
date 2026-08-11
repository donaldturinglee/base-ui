import TopicTagBase from "./TopicTag";
import TopicTagGroup from "./TopicTagGroup";

export const TopicTag = Object.assign(TopicTagBase, {
    Group: TopicTagGroup,
});

export { TopicTagGroup };
export * from "./TopicTag.types";
