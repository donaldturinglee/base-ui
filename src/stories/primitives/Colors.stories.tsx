import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../components/code";
import { Heading } from "../../components/heading";
import { Stack } from "../../components/stack";
import { Text } from "../../components/text";

const classes = {
    // A specimen sheet rather than prose, so it is given the width it is opened in and only
    // the padding the stories elsewhere give themselves
    page: "p-[var(--base-size-24)]",
    // A ramp is read across, so its steps stay on one line for as long as there is room for
    // them and only wrap once there is not
    ramp: "flex flex-wrap gap-[var(--base-size-4)]",
    step: "flex w-[4.5rem] flex-col gap-[var(--base-size-2)]",
    // Every chip carries an outline of its own, since a step at either end of a ramp is drawn
    // in whatever the page behind it is drawn in and would otherwise have no edge at all
    chip: "h-[2.5rem] rounded-[var(--border-radius-medium)] border border-solid border-border-muted",
    swatch: "flex items-center gap-[var(--base-size-12)]",
    // The tokens are named down the page, so the chip beside each one is held to one width and
    // the names line up rather than stepping in and out with the length of what is above them
    tile: "h-[2.5rem] w-[4.5rem] shrink-0 rounded-[var(--border-radius-medium)] border border-solid border-border-muted",
    // A colour meant for text is read by whether text is readable in it, so the specimen is a
    // letterform on the muted background rather than a filled tile
    letter: "flex h-[2.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[var(--border-radius-medium)] border border-solid border-border-muted bg-background-muted",
    outline:
        "h-[2.5rem] w-[4.5rem] shrink-0 rounded-[var(--border-radius-medium)] border-4 border-solid",
    grid: "grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-[var(--base-size-16)]",
    muted: "text-foreground-muted",
    // The value is read as a value rather than as prose, so it is set in the monospace stack the
    // rest of the library sets code in
    value: "text-foreground-muted font-[family-name:var(--font-stack-monospace)]",
};

// The palette, one scale to a row. Neutral runs further than the rest because it is what the
// page itself is built out of, and needs steps between the two ends that the hues do not
const scales = [
    { name: "neutral", steps: 14 },
    { name: "blue", steps: 10 },
    { name: "green", steps: 10 },
    { name: "yellow", steps: 10 },
    { name: "orange", steps: 10 },
    { name: "red", steps: 10 },
    { name: "purple", steps: 10 },
    { name: "pink", steps: 10 },
    { name: "coral", steps: 10 },
];

// The scales the display colours are drawn from, which are not the palette above: they are for
// labelling one thing against another rather than for saying what state anything is in
const displayScales = [
    "auburn",
    "blue",
    "brown",
    "coral",
    "cyan",
    "gray",
    "green",
    "indigo",
    "lemon",
    "lime",
    "olive",
    "orange",
    "pine",
    "pink",
    "plum",
    "purple",
    "red",
    "teal",
    "yellow",
];

// The roles that carry both an emphasis and a muted token. Emphasis is the role said outright,
// muted is the same role said quietly enough to sit behind something else
const roles = [
    "accent",
    "attention",
    "closed",
    "danger",
    "done",
    "draft",
    "neutral",
    "open",
    "severe",
    "sponsors",
    "success",
    "upsell",
];

const foregrounds = [
    "default",
    "muted",
    "accent",
    "link",
    "success",
    "attention",
    "severe",
    "danger",
    "done",
    "sponsors",
    "upsell",
    "open",
    "closed",
    "draft",
    "neutral",
    "disabled",
    "on-emphasis",
    "on-inverse",
    "black",
    "white",
];

const backgrounds = [
    "default",
    "muted",
    "inset",
    "emphasis",
    "inverse",
    "disabled",
    "transparent",
    "black",
    "white",
    ...roles.flatMap((role) => [`${role}-emphasis`, `${role}-muted`]),
];

const borders = [
    "default",
    "muted",
    "emphasis",
    "disabled",
    "translucent",
    "transparent",
    ...roles.flatMap((role) => [`${role}-emphasis`, `${role}-muted`]),
];

const token = (name: string) => `--${name}`;

const paletteTokens = scales.flatMap(({ name, steps }) =>
    Array.from({ length: steps }, (_, step) => token(`base-color-${name}-${step}`)),
);

const displayTokens = displayScales.flatMap((name) =>
    Array.from({ length: 10 }, (_, step) => token(`base-display-color-${name}-${step}`)),
);

const foregroundTokens = foregrounds.map((name) => token(`foreground-color-${name}`));

const backgroundTokens = backgrounds.map((name) => token(`background-color-${name}`));

const borderTokens = borders.map((name) => token(`border-color-${name}`));

// What a token actually resolves to under the scheme in force. A swatch is drawn correctly by
// the custom property on its own, but the value written beside it is a string React has to be
// given — and the scheme is changed by an attribute on the root element, which nothing in the
// tree changes with, so the attribute is watched rather than waited on
const useResolvedValues = (names: string[]) => {
    const [values, setValues] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        const root = document.documentElement;

        const read = () => {
            const style = getComputedStyle(root);
            setValues(
                Object.fromEntries(
                    names.map((name) => [name, style.getPropertyValue(name).trim()]),
                ),
            );
        };

        read();

        const observer = new MutationObserver(read);
        observer.observe(root, { attributeFilter: ["data-theme"] });

        return () => observer.disconnect();
    }, [names]);

    return values;
};

const Ramp = ({
    label,
    names,
    values,
}: {
    label: string;
    names: string[];
    values: Record<string, string>;
}) => (
    <Stack gap="condensed">
        <Text size="small" weight="semibold">
            {label}
        </Text>
        <div className={classes.ramp}>
            {names.map((name, step) => (
                <div key={name} className={classes.step}>
                    <div
                        className={classes.chip}
                        style={{ backgroundColor: `var(${name})` }}
                        title={name}
                    />
                    <Text size="small" className={classes.muted}>
                        {step}
                    </Text>
                    <Text size="small" className={classes.value}>
                        {values[name]}
                    </Text>
                </div>
            ))}
        </div>
    </Stack>
);

const Swatch = ({
    name,
    value,
    children,
}: React.PropsWithChildren<{ name: string; value?: string }>) => (
    <div className={classes.swatch}>
        {children}
        <Stack gap="none">
            <Text size="small">{name}</Text>
            <Text size="small" className={classes.value}>
                {value}
            </Text>
        </Stack>
    </div>
);

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Primitives/Colors",
    decorators: [withPage],
};

// What the colours are, which is two things rather than one: a palette that changes with the
// scheme, and a set of names for what a colour is being used to say
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            Colors
        </Heading>
        <Text as="p">
            Colour is held at two levels. Underneath is a palette — nine scales, declared once for
            each scheme against <Code>[data-theme]</Code>, with every step in one answered by a step
            of the same name in the other. Above it are the semantic tokens, which are what a
            component actually names: <Code>--foreground-color-danger</Code> rather than a red.
        </Text>
        <Text as="p">
            Nothing is drawn from the palette directly. A component that named a colour would be
            correct under the scheme it was written against and wrong under the other one, so it
            names what the colour is for and is drawn correctly under both. Everything on this page
            follows the scheme the toolbar is set to.
        </Text>
    </Stack>
);

// The Palette, which is what everything else is derived from and is worth seeing whole, since a
// step is chosen by where it stands in its scale rather than by what it looks like on its own
export const Palette: StoryFn = () => {
    const values = useResolvedValues(paletteTokens);

    return (
        <Stack gap="spacious">
            {scales.map(({ name, steps }) => (
                <Ramp
                    key={name}
                    label={name}
                    names={Array.from({ length: steps }, (_, step) =>
                        token(`base-color-${name}-${step}`),
                    )}
                    values={values}
                />
            ))}
        </Stack>
    );
};

// Foreground, drawn as what it is for rather than as a swatch: a colour meant for text is read
// by whether the text is readable in it
export const Foreground: StoryFn = () => {
    const values = useResolvedValues(foregroundTokens);

    return (
        <div className={classes.grid}>
            {foregrounds.map((name) => (
                <Swatch
                    key={name}
                    name={`--foreground-color-${name}`}
                    value={values[token(`foreground-color-${name}`)]}
                >
                    <div className={classes.letter}>
                        <Text
                            size="large"
                            weight="semibold"
                            style={{ color: `var(--foreground-color-${name})` }}
                        >
                            Aa
                        </Text>
                    </div>
                </Swatch>
            ))}
        </div>
    );
};

// Background, where each role carries an emphasis and a muted: the first says the role outright,
// the second says it quietly enough for something else to be read on top of it
export const Background: StoryFn = () => {
    const values = useResolvedValues(backgroundTokens);

    return (
        <div className={classes.grid}>
            {backgrounds.map((name) => (
                <Swatch
                    key={name}
                    name={`--background-color-${name}`}
                    value={values[token(`background-color-${name}`)]}
                >
                    <div
                        className={classes.tile}
                        style={{ backgroundColor: `var(--background-color-${name})` }}
                    />
                </Swatch>
            ))}
        </div>
    );
};

// Border, which answers the background roles one for one, so an element bordered and filled from
// the same role is drawn from a pair that were chosen against each other
export const Border: StoryFn = () => {
    const values = useResolvedValues(borderTokens);

    return (
        <div className={classes.grid}>
            {borders.map((name) => (
                <Swatch
                    key={name}
                    name={`--border-color-${name}`}
                    value={values[token(`border-color-${name}`)]}
                >
                    <div
                        className={classes.outline}
                        style={{ borderColor: `var(--border-color-${name})` }}
                    />
                </Swatch>
            ))}
        </div>
    );
};

// Display, which is a separate palette and not a longer one: these are for telling one label
// from the next, so what matters is that they are distinguishable rather than what they mean
export const Display: StoryFn = () => {
    const values = useResolvedValues(displayTokens);

    return (
        <Stack gap="spacious">
            {displayScales.map((name) => (
                <Ramp
                    key={name}
                    label={name}
                    names={Array.from({ length: 10 }, (_, step) =>
                        token(`base-display-color-${name}-${step}`),
                    )}
                    values={values}
                />
            ))}
        </Stack>
    );
};
