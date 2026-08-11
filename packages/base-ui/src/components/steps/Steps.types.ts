import type * as React from "react";

// How far along a step is. The steps before the one the flow has reached are done, the one it
// has reached is being worked on, and the rest are still to come
export type StepStatus = "complete" | "current" | "incomplete";

// Which way the steps run, and so which way the connector between them is drawn
export type StepsOrientation = "horizontal" | "vertical";

export type StepsSize = "small" | "medium";

// `role` is dropped because the list has to keep saying it is one: Safari takes the
// semantics away from a list with no markers
export type StepsProps = Omit<React.ComponentPropsWithoutRef<"ol">, "role"> & {
    // Which step the flow has reached, counted from one so that it names the number the step
    // is drawn with. Nought leaves every step still to come, and a number past the last of
    // them leaves the whole flow done
    currentStep?: number;
    orientation?: StepsOrientation;
    size?: StepsSize;
    className?: string;
};

export type StepsItemProps = React.ComponentPropsWithoutRef<"li"> & {
    // Says where the step stands in its own right, rather than leaving it to be worked out
    // from the step the flow has reached
    status?: StepStatus;
    // What a screen reader hears for the state the step is in, where the words it is given by
    // default do not fit the flow. An empty string leaves the state unsaid
    statusLabel?: string;
    className?: string;
};

export type StepsIndicatorProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type StepsBodyProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type StepsTitleProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type StepsDescriptionProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type StepsItemContextValue = {
    // Where the step stands in the list, counted from nought
    index: number;
    status: StepStatus;
};
