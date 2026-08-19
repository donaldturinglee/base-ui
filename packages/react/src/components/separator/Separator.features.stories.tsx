import type { StoryFn } from "@storybook/react-vite";
import { Link } from "../link";
import { Stack } from "../stack";
import { Text } from "../text";
import { Separator } from ".";

const classes = {
    // Gives the horizontal lines a container to run the width of
    container: "w-[20rem]",
    // Stands the vertical lines against something tall enough to see them by
    row: "h-[var(--base-size-24)]",
};

export default {
    title: "Components/Separator/Features",
};

// Variant Scale
export const VariantScale: StoryFn<typeof Separator> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["subtle", "default", "emphasis"] as const).map((variant) => (
            <Stack key={variant} gap="condensed">
                <Text size="small">variant=&quot;{variant}&quot;</Text>
                <Separator variant={variant} />
            </Stack>
        ))}
    </Stack>
);

// Horizontal, which is the way a separator runs unless it is told otherwise
export const Horizontal: StoryFn<typeof Separator> = () => (
    <Stack gap="normal" className={classes.container}>
        <Text as="p">Deleting this repository takes it away from everyone who can reach it.</Text>
        <Separator />
        <Text as="p">Transferring it hands it on instead, along with everything on it.</Text>
    </Stack>
);

// Vertical, which takes its height from whatever it stands beside
export const Vertical: StoryFn<typeof Separator> = () => (
    <Stack direction="horizontal" gap="normal" align="center" className={classes.row}>
        <Link href="#">Overview</Link>
        <Separator orientation="vertical" />
        <Link href="#">Settings</Link>
        <Separator orientation="vertical" />
        <Link href="#">Members</Link>
    </Stack>
);

// Decorative, for a line that says nothing a reader needs to hear
export const Decorative: StoryFn<typeof Separator> = () => (
    <Stack gap="normal" className={classes.container}>
        <Text>Above the line</Text>
        <Separator role="presentation" />
        <Text>Below the line</Text>
    </Stack>
);

// Repainted, where the line is given a colour of its own rather than one off the scale
export const Repainted: StoryFn<typeof Separator> = () => (
    <Stack gap="normal" className={classes.container}>
        <Text>Above the line</Text>
        <Separator className="[--separator-color:var(--border-color-accent-emphasis)]" />
        <Text>Below the line</Text>
    </Stack>
);

// As An Hr Element, for markup that says the same thing on its own
export const AsAnHrElement: StoryFn<typeof Separator> = () => (
    <Stack gap="normal" className={classes.container}>
        <Text>Above the line</Text>
        <Separator as="hr" />
        <Text>Below the line</Text>
    </Stack>
);
