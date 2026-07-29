import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Heading } from "../heading";
import { registerPortalRoot } from "../portal";
import { Stack } from "../stack";
import { Text } from "../text";
import { AnchoredOverlay } from ".";
import type { AnchorSide } from "../tooltip";

const classes = {
    // Leaves room around the anchor for the overlay to stand in
    container: "p-[var(--base-size-64)]",
    // Gives the content a width to sit in rather than the width of the page
    content: "w-[18rem]",
    scrollingRegion:
        "relative h-[15rem] overflow-auto border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)] rounded-[var(--border-radius-medium)]",
    scrollingContent: "h-[40rem] p-[var(--base-size-16)]",
};

export default {
    title: "Components/AnchoredOverlay/Features",
    parameters: {
        layout: "centered",
    },
};

// What the overlay holds in every story, so that each one is only about the overlay itself
const Content = ({ children }: { children?: React.ReactNode }) => (
    <Stack gap="condensed" padding="normal" className={classes.content}>
        {children ?? (
            <Text size="medium">
                The branch was merged an hour ago, and the two commits on it are now on main.
            </Text>
        )}
    </Stack>
);

// Custom Anchor Id, where the anchor is named by the caller rather than by the overlay
export const CustomAnchorId: StoryFn<typeof AnchoredOverlay> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <AnchoredOverlay
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                anchorId="my-custom-anchor-id"
                overlayProps={{ role: "dialog", "aria-label": "Merge details" }}
            >
                <Content />
            </AnchoredOverlay>
        </div>
    );
};

// Anchor Side, which is the edge of the anchor the overlay stands off
export const AnchorSides: StoryFn<typeof AnchoredOverlay> = () => {
    const sides: AnchorSide[] = ["outside-top", "outside-right", "outside-bottom", "outside-left"];
    const [openSide, setOpenSide] = React.useState<AnchorSide | null>(null);

    return (
        <div className={classes.container}>
            <Stack direction="horizontal" gap="normal" wrap="wrap">
                {sides.map((side) => (
                    <AnchoredOverlay
                        key={side}
                        open={openSide === side}
                        onOpen={() => setOpenSide(side)}
                        onClose={() => setOpenSide(null)}
                        side={side}
                        renderAnchor={(props) => <Button {...props}>{side}</Button>}
                        overlayProps={{ role: "dialog", "aria-label": `Standing ${side}` }}
                    >
                        <Content>
                            <Text size="medium">Standing {side}</Text>
                        </Content>
                    </AnchoredOverlay>
                ))}
            </Stack>
        </div>
    );
};

// Anchor Alignment, which is where along that edge the overlay lines up
export const AnchorAlignment: StoryFn<typeof AnchoredOverlay> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <AnchoredOverlay
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                align="center"
                renderAnchor={(props) => (
                    <Button {...props} block>
                        Open overlay
                    </Button>
                )}
                overlayProps={{ role: "dialog", "aria-label": "Merge details" }}
            >
                <Content />
            </AnchoredOverlay>
        </div>
    );
};

// Width, taken from the overlay scale rather than from what the overlay holds
export const Width: StoryFn<typeof AnchoredOverlay> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <AnchoredOverlay
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                width="large"
                renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                overlayProps={{ role: "dialog", "aria-label": "Merge details" }}
            >
                <Content />
            </AnchoredOverlay>
        </div>
    );
};

// Height, in the same way
export const Height: StoryFn<typeof AnchoredOverlay> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <AnchoredOverlay
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                height="large"
                renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                overlayProps={{ role: "dialog", "aria-label": "Merge details" }}
            >
                <Content />
            </AnchoredOverlay>
        </div>
    );
};

// Offset Position From Anchor, which is how far the overlay stands clear of it
export const OffsetPositionFromAnchor: StoryFn<typeof AnchoredOverlay> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <AnchoredOverlay
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                anchorOffset={40}
                renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                overlayProps={{ role: "dialog", "aria-label": "Merge details" }}
            >
                <Content />
            </AnchoredOverlay>
        </div>
    );
};

// Offset Alignment From Anchor, which is how far it is moved along the edge it lines up
// against
export const OffsetAlignmentFromAnchor: StoryFn<typeof AnchoredOverlay> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <AnchoredOverlay
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                alignmentOffset={40}
                renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                overlayProps={{ role: "dialog", "aria-label": "Merge details" }}
            >
                <Content />
            </AnchoredOverlay>
        </div>
    );
};

// Focus Trap Overrides, where something other than the first button takes focus
export const FocusTrapOverrides: StoryFn<typeof AnchoredOverlay> = () => {
    const initialFocusRef = React.useRef<HTMLButtonElement>(null);
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <AnchoredOverlay
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                focusTrapSettings={{ initialFocusRef }}
                renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                overlayProps={{ role: "dialog", "aria-label": "Focus trap overrides" }}
            >
                <Content>
                    <Button>First button</Button>
                    <Button ref={initialFocusRef}>Initial focus</Button>
                </Content>
            </AnchoredOverlay>
        </div>
    );
};

// Overlay Props Overrides, which reach the overlay itself rather than the anchor
export const OverlayPropsOverrides: StoryFn<typeof AnchoredOverlay> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <AnchoredOverlay
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                height="small"
                renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                overlayProps={{
                    role: "dialog",
                    "aria-label": "Merge details",
                    style: { overflow: "auto" },
                }}
            >
                <Content>
                    <Text size="medium">The overlay has been given a scrolling body.</Text>
                    {Array.from({ length: 12 }, (_, index) => (
                        <Text key={index} size="medium">
                            Commit {index + 1}
                        </Text>
                    ))}
                </Content>
            </AnchoredOverlay>
        </div>
    );
};

// Fullscreen Variant, which gives a narrow viewport the whole screen and a close button
export const FullscreenVariant: StoryFn<typeof AnchoredOverlay> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <AnchoredOverlay
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                variant={{ regular: "anchored", narrow: "fullscreen" }}
                renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                overlayProps={{ role: "dialog", "aria-label": "Merge details" }}
            >
                <Content>
                    <Text size="medium">
                        Narrow the viewport, and the overlay takes the whole screen with a button to
                        close it.
                    </Text>
                </Content>
            </AnchoredOverlay>
        </div>
    );
};

// Detached Anchor, where the overlay stands against an element it did not render
export const DetachedAnchor: StoryFn<typeof AnchoredOverlay> = () => {
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.container}>
            <Stack direction="horizontal" gap="normal">
                <Button ref={anchorRef}>The anchor</Button>
                <Button onClick={() => setOpen(!open)}>Toggle the overlay</Button>
            </Stack>
            <AnchoredOverlay
                open={open}
                onClose={() => setOpen(false)}
                renderAnchor={null}
                anchorRef={anchorRef}
                overlayProps={{ role: "dialog", "aria-label": "Merge details" }}
            >
                <Content />
            </AnchoredOverlay>
        </div>
    );
};

// Portal Inside Scrolling Element, where the overlay is rendered into the region it stands
// over and follows its anchor as the region is scrolled
export const PortalInsideScrollingElement: StoryFn<typeof AnchoredOverlay> = () => {
    const scrollingRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [registered, setRegistered] = React.useState(false);

    React.useEffect(() => {
        if (scrollingRef.current) {
            registerPortalRoot(scrollingRef.current, "scrollingPortal");
            setRegistered(true);
        }
    }, []);

    return (
        <div className={classes.container}>
            <Heading as="h2">Header or some such</Heading>
            <div ref={scrollingRef} className={classes.scrollingRegion}>
                <div className={classes.scrollingContent}>
                    {registered ? (
                        <AnchoredOverlay
                            open={open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                            overlayProps={{
                                role: "dialog",
                                "aria-label": "Merge details",
                                portalContainerName: "scrollingPortal",
                            }}
                        >
                            <Content />
                        </AnchoredOverlay>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
