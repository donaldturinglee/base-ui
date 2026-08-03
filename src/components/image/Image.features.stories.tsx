import type { StoryFn } from "@storybook/react-vite";
import { AspectRatio } from "../aspect-ratio";
import { Stack } from "../stack";
import { Text } from "../text";
import { Image } from ".";

const classes = {
    // Gives the picture a box wider than it is tall, so a fit has something to answer
    box: "w-[12rem] h-[6rem]",
    // Holds the composed examples to a column of a readable width
    container: "w-[20rem]",
};

// Pictures drawn on the page rather than fetched over the network, so the stories stand up with
// nothing behind them
const drawn = (body: string) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">${body}</svg>`,
    );

const SOURCE = drawn(
    `<rect width="240" height="240" fill="#0969da" />
     <circle cx="120" cy="96" r="48" fill="#ffd642" />
     <path d="M0 240 96 128l72 72 40-40 32 32z" fill="#1a7f37" />`,
);

const FALLBACK = drawn(
    `<rect width="240" height="240" fill="#eff2f5" />
     <path d="M60 150h120M60 90h120" stroke="#818b98" stroke-width="16" stroke-linecap="round" />`,
);

// A source that cannot be reached, so the fallback beside it is the one that is shown
const MISSING = "https://example.invalid/missing.png";

export default {
    title: "Components/Image/Features",
};

// Fit Scale, shown against a box wider than the picture it is given
export const FitScale: StoryFn<typeof Image> = () => (
    <Stack gap="normal">
        {(["contain", "cover", "fill", "none", "scale-down"] as const).map((fit) => (
            <Stack key={fit} gap="condensed">
                <Text size="small">fit=&quot;{fit}&quot;</Text>
                <Image
                    src={SOURCE}
                    alt="A hillside under a low sun"
                    fit={fit}
                    className={classes.box}
                />
            </Stack>
        ))}
    </Stack>
);

// Border Radius Scale
export const BorderRadiusScale: StoryFn<typeof Image> = () => (
    <Stack gap="normal">
        {(["none", "small", "medium", "large", "full"] as const).map((borderRadius) => (
            <Stack key={borderRadius} gap="condensed">
                <Text size="small">borderRadius=&quot;{borderRadius}&quot;</Text>
                <Image
                    src={SOURCE}
                    alt="A hillside under a low sun"
                    borderRadius={borderRadius}
                    className={classes.box}
                />
            </Stack>
        ))}
    </Stack>
);

// With A Fallback, where the source cannot be reached and the one held in reserve takes its place
export const WithAFallback: StoryFn<typeof Image> = () => (
    <Image
        src={MISSING}
        fallbackSrc={FALLBACK}
        alt="A hillside under a low sun"
        className={classes.box}
    />
);

// In An Aspect Ratio, where the box holds its place on the page before the picture has loaded
export const InAnAspectRatio: StoryFn<typeof Image> = () => (
    <Stack gap="normal" className={classes.container}>
        <AspectRatio ratio="16:9">
            <Image src={SOURCE} alt="A hillside under a low sun" />
        </AspectRatio>
        <Text as="p" size="small">
            The picture is cropped to the shape of the box rather than the box being stretched to
            the shape of the picture.
        </Text>
    </Stack>
);

// Decorative, for a picture that tells a reader nothing the words beside it do not already
export const Decorative: StoryFn<typeof Image> = () => (
    <Stack gap="condensed" className={classes.container}>
        <Image src={SOURCE} className={classes.box} />
        <Text as="p">A hillside under a low sun, as the words here have already said.</Text>
    </Stack>
);

// Fetched At Once, for a picture already in view when the page is opened
export const FetchedAtOnce: StoryFn<typeof Image> = () => (
    <Image src={SOURCE} alt="A hillside under a low sun" loading="eager" className={classes.box} />
);
