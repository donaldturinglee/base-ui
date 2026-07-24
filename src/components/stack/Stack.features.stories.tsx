import type { StoryFn } from "@storybook/react-vite";
import { Placeholder } from "../placeholder";
import { Text } from "../text";
import { Stack } from ".";

export default {
    title: "Components/Stack/Features",
};

const ScaleLabel = ({ label }: { label: string }) => (
    <Text size="small" className="text-[var(--foreground-color-muted)]">
        {label}
    </Text>
);

// Horizontal Direction
export const HorizontalDirection: StoryFn<typeof Stack> = () => (
    <Stack direction="horizontal">
        <Placeholder height="64px" label="First" />
        <Placeholder height="64px" label="Second" />
        <Placeholder height="64px" label="Third" />
    </Stack>
);

// Gap Scale
export const GapScale: StoryFn<typeof Stack> = () => (
    <Stack gap="spacious">
        {(["none", "tight", "condensed", "cozy", "normal", "spacious"] as const).map((gap) => (
            <Stack key={gap}>
                <ScaleLabel label={`gap="${gap}"`} />
                <Stack direction="horizontal" gap={gap}>
                    <Placeholder width="64px" height="48px" label="A" />
                    <Placeholder width="64px" height="48px" label="B" />
                    <Placeholder width="64px" height="48px" label="C" />
                </Stack>
            </Stack>
        ))}
    </Stack>
);

// Padding Scale
export const PaddingScale: StoryFn<typeof Stack> = () => (
    <Stack gap="spacious">
        {(["none", "tight", "condensed", "cozy", "normal", "spacious"] as const).map((padding) => (
            <Stack key={padding}>
                <ScaleLabel label={`padding="${padding}"`} />
                <Stack padding={padding} className="bg-[var(--background-color-inset)]">
                    <Placeholder height="48px" label="Content" />
                </Stack>
            </Stack>
        ))}
    </Stack>
);

// Directional Padding
export const DirectionalPadding: StoryFn<typeof Stack> = () => (
    <Stack gap="normal">
        <Stack padding="normal" className="bg-[var(--background-color-inset)]">
            <Placeholder height="48px" label='padding="normal" (all sides)' />
        </Stack>
        <Stack
            padding="normal"
            paddingInline="spacious"
            className="bg-[var(--background-color-inset)]"
        >
            <Placeholder height="48px" label='padding="normal" paddingInline="spacious"' />
        </Stack>
        <Stack
            paddingBlock="condensed"
            paddingInline="spacious"
            className="bg-[var(--background-color-inset)]"
        >
            <Placeholder height="48px" label='paddingBlock="condensed" paddingInline="spacious"' />
        </Stack>
    </Stack>
);
