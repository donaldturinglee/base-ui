import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { classNames } from "../../lib/classnames";
import { useIsClipped } from "../../hooks/useIsClipped";
import { OverflowObserverProvider } from ".";

const classes = {
    // The row is held to a single line and hides whatever runs past it, which is the clipping the
    // shared observer is scoped to. It is left resizable so the point at which each item is cut
    // off can be found by dragging the corner
    row: "flex w-[24rem] max-w-full resize-x items-center gap-[var(--base-size-8)] overflow-hidden [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-8)]",
    item: "shrink-0 whitespace-nowrap [border-radius:var(--border-radius-medium)] px-[var(--base-size-8)] py-[var(--base-size-4)]",
    fits: "bg-background-accent-muted text-foreground-accent",
    clipped: "bg-background-danger-muted text-foreground-danger",
    legend: "mt-[var(--base-size-8)] text-[var(--foreground-color-muted)]",
};

export default {
    title: "Components/OverflowObserverProvider",
    component: OverflowObserverProvider,
} as Meta<typeof OverflowObserverProvider>;

// One item of the row. It says nothing about where it stands, only whether the row still shows
// the whole of it, which is what the shared observer above it answers
const Item = ({ label }: { label: string }) => {
    const ref = React.useRef<HTMLSpanElement>(null);
    const isClipped = useIsClipped({ ref });

    return (
        <span
            ref={ref}
            className={classNames(classes.item, isClipped ? classes.clipped : classes.fits)}
        >
            {label}
        </span>
    );
};

const Row = ({ count }: { count: number }) => {
    const rootRef = React.useRef<HTMLDivElement>(null);

    return (
        <div>
            <div ref={rootRef} className={classes.row}>
                <OverflowObserverProvider rootRef={rootRef}>
                    {Array.from({ length: count }, (_, index) => (
                        <Item key={index} label={`Item ${index + 1}`} />
                    ))}
                </OverflowObserverProvider>
            </div>
            <div className={classes.legend}>Drag the corner of the row to narrow it</div>
        </div>
    );
};

export const Default: StoryFn<typeof OverflowObserverProvider> = () => <Row count={6} />;

Default.parameters = {
    layout: "centered",
};

type PlaygroundArgs = {
    count: number;
};

export const Playground: StoryFn<PlaygroundArgs> = ({ count }) => <Row count={count} />;

Playground.args = {
    count: 6,
};

Playground.argTypes = {
    count: {
        control: {
            type: "number",
        },
        description: "How many items the row is given to hold",
    },
};

Playground.parameters = {
    layout: "centered",
};
