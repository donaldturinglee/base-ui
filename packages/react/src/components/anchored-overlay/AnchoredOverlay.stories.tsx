import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { Link } from "../link";
import { Stack } from "../stack";
import { Text } from "../text";
import { AnchoredOverlay } from ".";
import type { AnchoredOverlayProps } from "./AnchoredOverlay.types";

const classes = {
    // Gives the card a width to sit in rather than the width of whatever it holds
    card: "w-[20rem]",
};

export default {
    title: "Components/AnchoredOverlay",
    component: AnchoredOverlay,
} as Meta<typeof AnchoredOverlay>;

// What the overlay holds in every story, so that each one is only about the overlay itself
const HoverCard = () => (
    <Stack gap="condensed" padding="normal" className={classes.card}>
        <Stack direction="horizontal" gap="condensed" justify="space-between">
            <Avatar size={48}>
                <Avatar.Image src="https://avatars.githubusercontent.com/u/7143434?v=4" />
            </Avatar>
            <Button size="small">Follow</Button>
        </Stack>
        <Stack gap="none">
            <Text weight="medium">monalisa</Text>
            <Link inline muted href="#">
                Monalisa Octocat
            </Link>
        </Stack>
        <Text size="medium">
            Former beach cat and champion swimmer. Now your friendly octopus with a normal face.
        </Text>
    </Stack>
);

export const Default: StoryFn<typeof AnchoredOverlay> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <AnchoredOverlay
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
            overlayProps={{
                role: "dialog",
                "aria-modal": true,
                "aria-label": "Monalisa Octocat",
            }}
        >
            <HoverCard />
        </AnchoredOverlay>
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<AnchoredOverlayProps> = (args) => {
    const [open, setOpen] = React.useState(false);

    return (
        <AnchoredOverlay
            {...args}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
            overlayProps={{
                role: "dialog",
                "aria-modal": true,
                "aria-label": "Monalisa Octocat",
            }}
        >
            <HoverCard />
        </AnchoredOverlay>
    );
};

Playground.args = {
    side: "outside-bottom",
    align: "start",
    width: "auto",
    height: "auto",
    anchorOffset: 4,
    alignmentOffset: 0,
    preventOverflow: true,
};

Playground.argTypes = {
    side: {
        control: {
            type: "radio",
        },
        options: ["outside-top", "outside-right", "outside-bottom", "outside-left"],
        description: "Which edge of the anchor the overlay stands off",
    },
    align: {
        control: {
            type: "radio",
        },
        options: ["start", "center", "end"],
        description: "Where along that edge it lines up",
    },
    width: {
        control: {
            type: "radio",
        },
        options: ["xsmall", "small", "medium", "large", "xlarge", "auto"],
        description: "A step of the overlay width scale, or the width of what it holds",
    },
    height: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large", "xlarge", "auto"],
        description: "A step of the overlay height scale, or the height of what it holds",
    },
    anchorOffset: {
        control: {
            type: "number",
        },
        description: "How far the overlay stands clear of the anchor",
    },
    alignmentOffset: {
        control: {
            type: "number",
        },
        description: "How far it is moved along the edge it lines up against",
    },
    preventOverflow: {
        control: {
            type: "boolean",
        },
        description: "Holds the overlay to its own width rather than narrowing it to fit",
    },
    open: {
        table: {
            disable: true,
        },
    },
    renderAnchor: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
