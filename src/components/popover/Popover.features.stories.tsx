import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Heading } from "../heading";
import { Text } from "../text";
import { Popover } from ".";
import type { PopoverCaret, PopoverContentWidth } from "./Popover.types";

const classes = {
    // Gives the popovers room to stand in, rather than against the edge of the frame
    container: "p-[var(--base-size-40)]",
    // Room enough on every side that a caret pointing outwards has somewhere to point
    grid: "grid grid-cols-3 gap-[var(--base-size-64)]",
    row: "flex flex-wrap items-start gap-[var(--base-size-32)]",
    stack: "flex flex-col items-start gap-[var(--base-size-16)]",
    body: "flex flex-col items-start gap-[var(--base-size-8)]",
    content: "mt-[var(--base-size-8)]",
    muted: "text-[var(--foreground-color-muted)]",
};

const carets: PopoverCaret[] = [
    "top-left",
    "top",
    "top-right",
    "left-top",
    "left",
    "left-bottom",
    "right-top",
    "right",
    "right-bottom",
    "bottom-left",
    "bottom",
    "bottom-right",
];

const widths: PopoverContentWidth[] = ["xsmall", "small", "medium", "auto"];

export default {
    title: "Components/Popover/Features",
};

// Where The Caret Stands. The first half of the name is the edge it stands on, the second is where
// along that edge, so `top-left` points up from over towards the left while `left-top` points left
// from up towards the top
export const Carets: StoryFn<typeof Popover> = () => (
    <div className={`${classes.container} ${classes.grid}`}>
        {carets.map((caret) => (
            <Popover key={caret} open relative caret={caret}>
                <Popover.Content width="auto" className={classes.content}>
                    <Text size="small">{caret}</Text>
                </Popover.Content>
            </Popover>
        ))}
    </div>
);

// Dismissed By A Press Outside. The control the popover was opened from is named as one to ignore,
// since it closes the popover itself and would otherwise be closing one this had already closed
export const CloseOnClickOutside: StoryFn<typeof Popover> = () => {
    const [open, setOpen] = React.useState(true);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    return (
        <div className={`${classes.container} ${classes.stack}`}>
            <Button ref={buttonRef} onClick={() => setOpen((current) => !current)}>
                Toggle popover
            </Button>

            <Popover open={open} relative caret="top-left">
                <Popover.Content
                    className={classes.content}
                    onClickOutside={() => setOpen(false)}
                    ignoreClickRefs={[buttonRef]}
                >
                    <div className={classes.body}>
                        <Heading size="small">Popover heading</Heading>
                        <Text as="p">Press anywhere else on the page to dismiss this popover.</Text>
                    </div>
                </Popover.Content>
            </Popover>
        </div>
    );
};

// Dismissed By Escape, which is what a reader who never reached for the pointer has to hand
export const CloseOnEscape: StoryFn<typeof Popover> = () => {
    const [open, setOpen] = React.useState(true);

    return (
        <div className={`${classes.container} ${classes.stack}`}>
            <Button onClick={() => setOpen((current) => !current)}>Toggle popover</Button>

            <Popover open={open} relative caret="top-left">
                <Popover.Content className={classes.content} onEscape={() => setOpen(false)}>
                    <div className={classes.body}>
                        <Heading size="small">Popover heading</Heading>
                        <Text as="p">Press Escape to dismiss this popover.</Text>
                    </div>
                </Popover.Content>
            </Popover>
        </div>
    );
};

// How Wide The Surface Stands. `auto` is as wide as what it holds; the rest are steps of the
// overlay scale the other floating surfaces are measured on
export const Widths: StoryFn<typeof Popover> = () => (
    <div className={`${classes.container} ${classes.row}`}>
        {widths.map((width) => (
            <Popover key={width} open relative caret="top">
                <Popover.Content width={width} className={classes.content}>
                    <Text size="small">{width}</Text>
                </Popover.Content>
            </Popover>
        ))}
    </div>
);

// Held To A Height, with what will not fit scrolled rather than run past the surface. The caret is
// drawn past the surface's edge, so anything that clips the content clips the caret off with it
export const Scrollable: StoryFn<typeof Popover> = () => (
    <div className={classes.container}>
        <Popover open relative caret="top">
            <Popover.Content height="small" overflow="auto" className={classes.content}>
                <div className={classes.body}>
                    <Heading size="small">Popover heading</Heading>
                    {Array.from({ length: 8 }, (_unused, index) => (
                        <Text key={index} as="p" className={classes.muted}>
                            A paragraph of the message this popover carries, long enough that there
                            is more of it than the surface has room for.
                        </Text>
                    ))}
                </div>
            </Popover.Content>
        </Popover>
    </div>
);
