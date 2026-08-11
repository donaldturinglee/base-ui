import type { StoryFn } from "@storybook/react-vite";
import {
    BranchForkRegular,
    BranchRegular,
    CheckmarkCircleRegular,
    CommentRegular,
    DismissCircleRegular,
} from "@gamecrafters/base-ui-icons";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { Link } from "../link";
import { Timeline } from ".";
import type { TimelineBadgeVariant } from "./Timeline.types";

const classes = {
    // Gives the timeline a container to lay itself out against
    container: "w-[36rem]",
    // A narrow container is what makes the item lay itself out again
    narrow: "w-[22rem]",
    // Leaves room in the gutter for an avatar to stand beside the rail
    gutter: "ps-[var(--base-size-80)]",
};

const variants: TimelineBadgeVariant[] = [
    "accent",
    "success",
    "attention",
    "severe",
    "danger",
    "done",
    "open",
    "closed",
    "sponsors",
];

export default {
    title: "Components/Timeline/Features",
};

// Clipped At The Start, where the rail begins at the first badge
export const ClippedAtTheStart: StoryFn<typeof Timeline> = () => (
    <div className={classes.container}>
        <Timeline clipSidebar="start">
            <Timeline.Item>
                <Timeline.Badge>
                    <BranchForkRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>Opened this pull request</Timeline.Body>
            </Timeline.Item>
            <Timeline.Item>
                <Timeline.Badge>
                    <BranchRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>Pushed two commits</Timeline.Body>
            </Timeline.Item>
        </Timeline>
    </div>
);

// Clipped At Both Ends, where the rail runs no further than the badges
export const ClippedAtBothEnds: StoryFn<typeof Timeline> = () => (
    <div className={classes.container}>
        <Timeline clipSidebar>
            <Timeline.Item>
                <Timeline.Badge>
                    <BranchForkRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>Opened this pull request</Timeline.Body>
            </Timeline.Item>
            <Timeline.Item>
                <Timeline.Badge>
                    <BranchRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>Pushed two commits</Timeline.Body>
            </Timeline.Item>
        </Timeline>
    </div>
);

// Condensed Items, for a run of small events
export const CondensedItems: StoryFn<typeof Timeline> = () => (
    <div className={classes.container}>
        <Timeline>
            {["Update the README", "Fix the build", "Bump the dependencies"].map((message) => (
                <Timeline.Item key={message} condensed>
                    <Timeline.Badge>
                        <BranchRegular aria-hidden="true" />
                    </Timeline.Badge>
                    <Timeline.Body>
                        <Link href="#" muted>
                            {message}
                        </Link>
                    </Timeline.Body>
                </Timeline.Item>
            ))}
        </Timeline>
    </div>
);

// With A Break, which cuts the rail between one run of events and the next
export const WithABreak: StoryFn<typeof Timeline> = () => (
    <div className={classes.container}>
        <Timeline>
            <Timeline.Item>
                <Timeline.Badge variant="done">
                    <CheckmarkCircleRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>Merged the pull request</Timeline.Body>
            </Timeline.Item>
            <Timeline.Break />
            <Timeline.Item>
                <Timeline.Badge>
                    <BranchRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>Reopened the branch</Timeline.Body>
            </Timeline.Item>
        </Timeline>
    </div>
);

// Badge Variants
export const BadgeVariants: StoryFn<typeof Timeline> = () => (
    <div className={classes.container}>
        <Timeline>
            {variants.map((variant) => (
                <Timeline.Item key={variant}>
                    <Timeline.Badge variant={variant}>
                        <CommentRegular aria-hidden="true" />
                    </Timeline.Badge>
                    <Timeline.Body>{variant}</Timeline.Body>
                </Timeline.Item>
            ))}
        </Timeline>
    </div>
);

// With Actions, which stand at the end of the item
export const WithActions: StoryFn<typeof Timeline> = () => (
    <div className={classes.container}>
        <Timeline>
            <Timeline.Item>
                <Timeline.Badge variant="done">
                    <CheckmarkCircleRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>Merged the pull request</Timeline.Body>
                <Timeline.Actions>
                    <Button size="small">View details</Button>
                    <Button size="small">Revert</Button>
                </Timeline.Actions>
            </Timeline.Item>
            <Timeline.Item>
                <Timeline.Badge variant="danger">
                    <DismissCircleRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>Two checks failed</Timeline.Body>
                <Timeline.Actions>
                    <Button size="small">Compare</Button>
                </Timeline.Actions>
            </Timeline.Item>
        </Timeline>
    </div>
);

// In A Narrow Container, where the actions drop below the body
export const InANarrowContainer: StoryFn<typeof Timeline> = () => (
    <div className={classes.narrow}>
        <Timeline>
            <Timeline.Item>
                <Timeline.Badge variant="done">
                    <CheckmarkCircleRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>Merged the pull request</Timeline.Body>
                <Timeline.Actions>
                    <Button size="small">View details</Button>
                    <Button size="small">Revert</Button>
                </Timeline.Actions>
            </Timeline.Item>
        </Timeline>
    </div>
);

// With An Avatar, which stands in the gutter beside the rail
export const WithAnAvatar: StoryFn<typeof Timeline> = () => (
    <div className={`${classes.container} ${classes.gutter}`}>
        <Timeline>
            <Timeline.Item>
                <Timeline.Avatar>
                    <Avatar src="https://avatars.githubusercontent.com/u/92997159?v=4" size={40} />
                </Timeline.Avatar>
                <Timeline.Badge variant="success">
                    <CheckmarkCircleRegular aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>
                    <Link href="#" muted>
                        monalisa
                    </Link>{" "}
                    approved these changes
                </Timeline.Body>
            </Timeline.Item>
        </Timeline>
    </div>
);
