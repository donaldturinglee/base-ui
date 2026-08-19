import type { StoryFn, Meta } from "@storybook/react-vite";
import { BranchForkRegular } from "@gamecrafters/base-ui-icons";
import { Timeline } from ".";
import type { TimelineProps } from "./Timeline.types";

const classes = {
    // Gives the timeline a container to lay itself out against
    container: "w-[36rem]",
};

export default {
    title: "Components/Timeline",
    component: Timeline,
} as Meta<typeof Timeline>;

export const Default: StoryFn<typeof Timeline> = () => (
    <div className={classes.container}>
        <Timeline>
            {["Opened this pull request", "Pushed two commits", "Merged the pull request"].map(
                (message) => (
                    <Timeline.Item key={message}>
                        <Timeline.Badge>
                            <BranchForkRegular aria-hidden="true" />
                        </Timeline.Badge>
                        <Timeline.Body>{message}</Timeline.Body>
                    </Timeline.Item>
                ),
            )}
        </Timeline>
    </div>
);

export const Playground: StoryFn<TimelineProps> = (args) => (
    <div className={classes.container}>
        <Timeline {...args}>
            {["Opened this pull request", "Pushed two commits", "Merged the pull request"].map(
                (message) => (
                    <Timeline.Item key={message}>
                        <Timeline.Badge>
                            <BranchForkRegular aria-hidden="true" />
                        </Timeline.Badge>
                        <Timeline.Body>{message}</Timeline.Body>
                    </Timeline.Item>
                ),
            )}
        </Timeline>
    </div>
);

Playground.args = {
    clipSidebar: false,
};

Playground.argTypes = {
    clipSidebar: {
        control: {
            type: "radio",
        },
        options: [false, true, "start", "end", "both"],
        description: "Trims the rail back to the first badge, the last, or both",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
