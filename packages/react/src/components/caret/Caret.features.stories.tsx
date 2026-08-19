import type { StoryFn } from "@storybook/react-vite";
import { Text } from "../text";
import { Caret } from ".";
import type { CaretLocation } from "./Caret.types";

const classes = {
    // Every caret is drawn past the edge of the surface it points from, so each one is given a
    // column of its own with room around it for the point to stand out into
    grid: "grid grid-cols-3 gap-[var(--base-size-40)] p-[var(--base-size-24)]",
    row: "flex items-center gap-[var(--base-size-40)] p-[var(--base-size-24)]",
    cell: "flex flex-col items-center gap-[var(--base-size-8)]",
    surface:
        "relative flex h-[4rem] w-[8rem] items-center justify-center rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)] bg-[var(--overlay-background-color)]",
    muted: "text-[var(--foreground-color-muted)]",
};

export default {
    title: "Components/Caret/Features",
};

const locations: CaretLocation[] = [
    "top",
    "top-left",
    "top-right",
    "right",
    "right-top",
    "right-bottom",
    "bottom",
    "bottom-left",
    "bottom-right",
    "left",
    "left-top",
    "left-bottom",
];

// Every Edge, And Every Place Along It
export const Locations: StoryFn<typeof Caret> = () => (
    <div className={classes.grid}>
        {locations.map((location) => (
            <div key={location} className={classes.cell}>
                <div className={classes.surface}>
                    <Caret location={location} />
                </div>
                <Text size="small" className={classes.muted}>
                    {location}
                </Text>
            </div>
        ))}
    </div>
);

// How Far The Point Stands Out
export const Size: StoryFn<typeof Caret> = () => (
    <div className={classes.row}>
        {[4, 8, 16].map((size) => (
            <div key={size} className={classes.cell}>
                <div className={classes.surface}>
                    <Caret size={size} />
                </div>
                <Text size="small" className={classes.muted}>
                    {`size={${size}}`}
                </Text>
            </div>
        ))}
    </div>
);

// Painted To Match Whatever It Points From
export const CustomColors: StoryFn<typeof Caret> = () => (
    <div className={classes.row}>
        <div className={classes.cell}>
            <div className={classes.surface}>
                <Caret background="var(--background-color-accent-muted)" />
            </div>
            <Text size="small" className={classes.muted}>
                background
            </Text>
        </div>
        <div className={classes.cell}>
            <div className={classes.surface}>
                <Caret borderColor="var(--border-color-accent-emphasis)" borderWidth={2} />
            </div>
            <Text size="small" className={classes.muted}>
                borderColor, borderWidth
            </Text>
        </div>
    </div>
);
