import type { StoryFn } from "@storybook/react-vite";
import { Link } from "../link";
import { Stack } from "../stack";
import { Text } from "../text";
import Divider from "./Divider";

const classes = {
    // Gives the horizontal lines a container to run the width of
    container: "w-[20rem]",
    // Stands the vertical lines against something tall enough to see them by
    row: "h-[var(--base-size-24)]",
};

export default {
    title: "Components/Divider/Features",
};

// Variant Scale
export const VariantScale: StoryFn<typeof Divider> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["subtle", "default", "emphasis"] as const).map((variant) => (
            <Stack key={variant} gap="condensed">
                <Text size="small">variant=&quot;{variant}&quot;</Text>
                <Divider variant={variant} />
            </Stack>
        ))}
    </Stack>
);

// Vertical, which takes its height from whatever it stands beside
export const Vertical: StoryFn<typeof Divider> = () => (
    <Stack direction="horizontal" gap="normal" align="center" className={classes.row}>
        <Link href="#">Overview</Link>
        <Divider orientation="vertical" />
        <Link href="#">Settings</Link>
        <Divider orientation="vertical" />
        <Link href="#">Members</Link>
    </Stack>
);

// Between Sections, where the line says one block has ended and another begun
export const BetweenSections: StoryFn<typeof Divider> = () => (
    <Stack gap="normal" className={classes.container}>
        <Text as="p">Deleting this repository takes it away from everyone who can reach it.</Text>
        <Divider />
        <Text as="p">Transferring it hands it on instead, along with everything on it.</Text>
    </Stack>
);

// Decorative, for a line that says nothing a reader needs to hear
export const Decorative: StoryFn<typeof Divider> = () => (
    <Stack gap="normal" className={classes.container}>
        <Text>Above the line</Text>
        <Divider role="presentation" />
        <Text>Below the line</Text>
    </Stack>
);

// As An HR Element, for markup that says the same thing on its own
export const AsAnHrElement: StoryFn<typeof Divider> = () => (
    <Stack gap="normal" className={classes.container}>
        <Text>Above the line</Text>
        <Divider as="hr" />
        <Text>Below the line</Text>
    </Stack>
);
