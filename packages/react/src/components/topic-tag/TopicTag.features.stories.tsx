import type { StoryFn } from "@storybook/react-vite";
import { TopicTag } from ".";

const classes = {
    // Gives the group a container narrow enough for the tags to wrap in
    container: "max-w-[20rem]",
};

const topics = [
    "react",
    "nodejs",
    "javascript",
    "typescript",
    "design-systems",
    "accessibility",
    "documentation",
    "tooling",
];

export default {
    title: "Components/TopicTag/Features",
    parameters: {
        layout: "centered",
    },
};

// As A Button
export const AsButton: StoryFn<typeof TopicTag> = () => <TopicTag as="button">react</TopicTag>;

// As Plain Text, which is not clickable
export const AsText: StoryFn<typeof TopicTag> = () => <TopicTag as="span">react</TopicTag>;

// In A Group
export const InAGroup: StoryFn<typeof TopicTag> = () => (
    <div className={classes.container}>
        <TopicTag.Group>
            {topics.map((topic) => (
                <TopicTag key={topic} href={`/topics/${topic}`}>
                    {topic}
                </TopicTag>
            ))}
        </TopicTag.Group>
    </div>
);

// In A List, where the group and its tags carry list semantics
export const InAList: StoryFn<typeof TopicTag> = () => (
    <div className={classes.container}>
        <TopicTag.Group as="ul" aria-label="Topics">
            {topics.map((topic) => (
                <li key={topic}>
                    <TopicTag href={`/topics/${topic}`}>{topic}</TopicTag>
                </li>
            ))}
        </TopicTag.Group>
    </div>
);
