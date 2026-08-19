import type { StoryFn } from "@storybook/react-vite";
import { CheckmarkCircleRegular, CloudRegular, DatabaseRegular } from "@gamecrafters/base-ui-icons";
import { Text } from "../text";
import { Flow } from ".";

const classes = {
    // A flow larger than the room it is given is scrolled to, so the stories give it a bounded
    // container to be scrolled within
    bounded: "max-w-[34rem]",
    step: "flex items-center gap-[var(--base-size-8)]",
    icon: "size-[var(--base-size-16)] shrink-0",
};

export default {
    title: "Components/Flow/Features",
    parameters: {
        layout: "centered",
    },
};

// Running Down The Page, for a flow with more steps than a line has room for. The steps either
// side of a group are lined up down the middle of it: a flow that reads downwards is read as a
// column, and a step sitting against the left edge of one would read as a branch of its own
export const Vertical: StoryFn<typeof Flow> = () => (
    <Flow orientation="vertical" align="center" aria-label="How a deployment runs">
        <Flow.Node>Push</Flow.Node>
        <Flow.Node>Build</Flow.Node>
        <Flow.Parallel>
            <Flow.Node>Unit tests</Flow.Node>
            <Flow.Node>Type check</Flow.Node>
        </Flow.Parallel>
        <Flow.Node>Deploy</Flow.Node>
    </Flow>
);

// A Branch Of More Than One Step, which is what Flow.List is for. The flow itself is already a
// run, so a branch only needs one where it holds more than a single step
export const BranchesOfSeveralSteps: StoryFn<typeof Flow> = () => (
    <Flow aria-label="How a request is served">
        <Flow.Node>Request</Flow.Node>
        <Flow.Parallel>
            <Flow.List>
                <Flow.Node>Cache</Flow.Node>
                <Flow.Node>Origin</Flow.Node>
            </Flow.List>
            <Flow.Node>Worker</Flow.Node>
        </Flow.Parallel>
        <Flow.Node>Response</Flow.Node>
    </Flow>
);

// Branches Ending Together, where a short branch is pushed along to finish beside the long one
// rather than beginning beside it
export const BranchesEndingTogether: StoryFn<typeof Flow> = () => (
    <Flow aria-label="How a request is served">
        <Flow.Node>Request</Flow.Node>
        <Flow.Parallel align="end">
            <Flow.List>
                <Flow.Node>Cache</Flow.Node>
                <Flow.Node>Origin</Flow.Node>
            </Flow.List>
            <Flow.Node>Worker</Flow.Node>
        </Flow.Parallel>
        <Flow.Node>Response</Flow.Node>
    </Flow>
);

// Lined Up Down The Middle, where a step shorter than the branches beside it stands level with
// them rather than with the top of the run
export const Centred: StoryFn<typeof Flow> = () => (
    <Flow align="center" aria-label="How a request is served">
        <Flow.Node>Request</Flow.Node>
        <Flow.Parallel>
            <Flow.Node>Cache</Flow.Node>
            <Flow.Node>Worker</Flow.Node>
            <Flow.Node>Origin</Flow.Node>
        </Flow.Parallel>
        <Flow.Node>Response</Flow.Node>
    </Flow>
);

// A Path That Cannot Be Taken, drawn faintly rather than left out, so the shape of the flow is
// still the shape of the flow
export const WithADisabledStep: StoryFn<typeof Flow> = () => (
    <Flow aria-label="How a request is served">
        <Flow.Node>Request</Flow.Node>
        <Flow.Parallel>
            <Flow.Node>Cache</Flow.Node>
            <Flow.Node disabled>Origin (unreachable)</Flow.Node>
        </Flow.Parallel>
        <Flow.Node>Response</Flow.Node>
    </Flow>
);

// Steps Drawn However The Caller Likes, since a step is whatever was put in it
export const WithRicherSteps: StoryFn<typeof Flow> = () => (
    <Flow aria-label="Where the data goes">
        <Flow.Node>
            <span className={classes.step}>
                <CloudRegular className={classes.icon} aria-hidden="true" />
                <Text>Edge</Text>
            </span>
        </Flow.Node>
        <Flow.Node>
            <span className={classes.step}>
                <DatabaseRegular className={classes.icon} aria-hidden="true" />
                <Text>Store</Text>
            </span>
        </Flow.Node>
        <Flow.Node>
            <span className={classes.step}>
                <CheckmarkCircleRegular className={classes.icon} aria-hidden="true" />
                <Text>Done</Text>
            </span>
        </Flow.Node>
    </Flow>
);

// Named Steps, where the caller says what each one is called so that a test or a stylesheet can
// point at it. The name is written out as `data-node-id` rather than as the element's own id, so
// two flows on a page cannot name the same thing
export const WithNamedSteps: StoryFn<typeof Flow> = () => (
    <Flow aria-label="How a request is served">
        <Flow.Node id="request">Request</Flow.Node>
        <Flow.Parallel>
            <Flow.Node id="cache">Cache</Flow.Node>
            <Flow.Node id="worker">Worker</Flow.Node>
        </Flow.Parallel>
        <Flow.Node id="response">Response</Flow.Node>
    </Flow>
);

// Larger Than The Room It Is Given, where the flow is scrolled to. It is put in the tab order
// once there is anything to scroll to, so a keyboard reaches the rest of it as well as a pointer
export const Scrolled: StoryFn<typeof Flow> = () => (
    <Flow className={classes.bounded} aria-label="How a build runs">
        <Flow.Node>Checkout</Flow.Node>
        <Flow.Node>Install</Flow.Node>
        <Flow.Node>Build</Flow.Node>
        <Flow.Node>Test</Flow.Node>
        <Flow.Node>Publish</Flow.Node>
    </Flow>
);

// Nested Branches, where a branch of a group holds a group of its own
export const NestedBranches: StoryFn<typeof Flow> = () => (
    <Flow aria-label="How a request is served">
        <Flow.Node>Request</Flow.Node>
        <Flow.Parallel>
            <Flow.List>
                <Flow.Node>Route</Flow.Node>
                <Flow.Parallel>
                    <Flow.Node>Cache</Flow.Node>
                    <Flow.Node>Origin</Flow.Node>
                </Flow.Parallel>
            </Flow.List>
            <Flow.Node>Worker</Flow.Node>
        </Flow.Parallel>
        <Flow.Node>Response</Flow.Node>
    </Flow>
);
