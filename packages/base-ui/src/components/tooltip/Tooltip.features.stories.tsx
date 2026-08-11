import type { StoryFn } from "@storybook/react-vite";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Link } from "../link";
import { Stack } from "../stack";
import { Tooltip } from ".";
import type { TooltipDirection } from "./Tooltip.types";

const classes = {
    // Leaves room around the triggers for the tooltips to stand in
    container: "p-[var(--base-size-64)]",
};

const directions: TooltipDirection[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

export default {
    title: "Components/Tooltip/Features",
    parameters: {
        layout: "centered",
    },
};

// Direction Scale, where each tooltip turns round if there is no room where it was sent
export const DirectionScale: StoryFn<typeof Tooltip> = () => (
    <div className={classes.container}>
        <Stack direction="horizontal" gap="normal" wrap="wrap">
            {directions.map((direction) => (
                <Tooltip key={direction} text={`Standing ${direction}`} direction={direction}>
                    <Button>{direction}</Button>
                </Tooltip>
            ))}
        </Stack>
    </div>
);

// Labelling An Icon Button, where the tooltip is the only name the button has
export const LabellingAnIconButton: StoryFn<typeof Tooltip> = () => (
    <div className={classes.container}>
        <Tooltip text="Close the panel" type="label" direction="n">
            <IconButton icon={DismissRegular} aria-label="Close the panel" variant="invisible" />
        </Tooltip>
    </div>
);

// Describing A Button, which already says what it does
export const DescribingAButton: StoryFn<typeof Tooltip> = () => (
    <div className={classes.container}>
        <Tooltip text="Everything on it goes with it" direction="n">
            <Button variant="danger">Delete repository</Button>
        </Tooltip>
    </div>
);

// Delay Scale, which sets how long the pointer has to rest before the tooltip appears
export const DelayScale: StoryFn<typeof Tooltip> = () => (
    <div className={classes.container}>
        <Stack direction="horizontal" gap="normal">
            {(["short", "medium", "long"] as const).map((delay) => (
                <Tooltip key={delay} text={`A ${delay} wait`} delay={delay} direction="n">
                    <Button>{delay}</Button>
                </Tooltip>
            ))}
        </Stack>
    </div>
);

// On A Link
export const OnALink: StoryFn<typeof Tooltip> = () => (
    <div className={classes.container}>
        <Tooltip text="Opens the search page" direction="n">
            <Link href="#">Search</Link>
        </Tooltip>
    </div>
);
