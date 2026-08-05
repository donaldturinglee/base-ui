import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Link } from "../link";
import { Text } from "../text";
import { HoverCard } from ".";
import type { AnchorSide } from "../tooltip/anchoredPosition";

const classes = {
    // Gives the card room to open into, rather than against the edge of the frame
    container: "p-[var(--base-size-40)]",
    // Stands the triggers far enough apart that the cards do not open on top of one another
    row: "flex flex-wrap items-center gap-[var(--base-size-32)]",
    stack: "flex flex-col items-start gap-[var(--base-size-8)]",
    body: "flex flex-col gap-[var(--base-size-8)]",
    lines: "flex flex-col gap-[var(--base-size-4)]",
    muted: "text-[var(--foreground-color-muted)]",
};

const sides: AnchorSide[] = ["outside-top", "outside-right", "outside-bottom", "outside-left"];

const profile = (
    <div className={classes.lines}>
        <Text weight="semibold">Mona Lisa Octocat</Text>
        <Text size="small" className={classes.muted}>
            Engineer at GitHub. Works on the things that hold the rest of it up.
        </Text>
    </div>
);

export default {
    title: "Components/HoverCard/Features",
};

// Which Side It Stands On, and what happens where there is no room on that side: the card is
// turned over to the other side of the trigger rather than being run off the edge of the page
export const Sides: StoryFn<typeof HoverCard> = () => (
    <div className={`${classes.container} ${classes.row}`}>
        {sides.map((side) => (
            <HoverCard key={side} side={side} openDelay={200}>
                <HoverCard.Trigger>
                    <Link href="#monalisa" inline>
                        {side.replace("outside-", "")}
                    </Link>
                </HoverCard.Trigger>
                <HoverCard.Content>{profile}</HoverCard.Content>
            </HoverCard>
        ))}
    </div>
);

// How Long It Waits, which is what keeps a pointer crossing the page from leaving a trail of
// cards behind it
export const Delays: StoryFn<typeof HoverCard> = () => (
    <div className={`${classes.container} ${classes.row}`}>
        <HoverCard openDelay={0}>
            <HoverCard.Trigger>
                <Link href="#monalisa" inline>
                    Opens at once
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>{profile}</HoverCard.Content>
        </HoverCard>
        <HoverCard openDelay={1000}>
            <HoverCard.Trigger>
                <Link href="#monalisa" inline>
                    Opens after a second
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>{profile}</HoverCard.Content>
        </HoverCard>
        <HoverCard closeDelay={1500}>
            <HoverCard.Trigger>
                <Link href="#monalisa" inline>
                    Stands a while once left
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>{profile}</HoverCard.Content>
        </HoverCard>
    </div>
);

// With Something To Reach Inside It, which is what sets a card apart from a tooltip: the pointer
// can travel onto the card and the card waits there while it does
export const WithInteractiveContent: StoryFn<typeof HoverCard> = () => (
    <div className={classes.container}>
        <HoverCard openDelay={200}>
            <HoverCard.Trigger>
                <Link href="#monalisa" inline>
                    monalisa
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>
                <div className={classes.body}>
                    {profile}
                    <Button size="small">Follow</Button>
                </div>
            </HoverCard.Content>
        </HoverCard>
    </div>
);

// Turned Off, for a trigger with nothing to say yet
export const Disabled: StoryFn<typeof HoverCard> = () => (
    <div className={`${classes.container} ${classes.row}`}>
        <HoverCard openDelay={200}>
            <HoverCard.Trigger>
                <Link href="#monalisa" inline>
                    Has a card
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>{profile}</HoverCard.Content>
        </HoverCard>
        <HoverCard openDelay={200} disabled>
            <HoverCard.Trigger>
                <Link href="#monalisa" inline>
                    Has none
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>{profile}</HoverCard.Content>
        </HoverCard>
    </div>
);

// Controlled, where the caller keeps hold of whether the card is open
export const Controlled: StoryFn<typeof HoverCard> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={`${classes.container} ${classes.stack}`}>
            <Button onClick={() => setOpen((current) => !current)}>
                {open ? "Close the card" : "Open the card"}
            </Button>

            <HoverCard open={open} onOpenChange={setOpen} openDelay={200}>
                <HoverCard.Trigger>
                    <Link href="#monalisa" inline>
                        monalisa
                    </Link>
                </HoverCard.Trigger>
                <HoverCard.Content>{profile}</HoverCard.Content>
            </HoverCard>

            <Text size="small" className={classes.muted}>
                The card is {open ? "open" : "shut"}. Hovering the name asks for it to open, and the
                button above says whether it does.
            </Text>
        </div>
    );
};
