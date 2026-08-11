import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { Rating } from ".";
import type { RatingSize } from "./Rating.types";

const classes = {
    // The stars are named by an element beside them, so the stories that read the two together
    // lay them out in a row
    row: "flex items-center gap-[var(--base-size-8)]",
    // The colour of the filled stars comes through a custom property, so a caller can repaint
    // them without having to unpick the classes they came with
    danger: "[--rating-fill-color:var(--foreground-color-danger)]",
};

const sizes: RatingSize[] = ["small", "medium", "large"];

export default {
    title: "Components/Rating/Features",
    parameters: {
        layout: "centered",
    },
};

// Sizes, which set how big the stars are drawn and how far apart they sit
export const Sizes: StoryFn<typeof Rating> = () => (
    <Stack gap="condensed">
        {sizes.map((size) => (
            <div key={size} className={classes.row}>
                <Rating size={size} defaultValue={3} aria-label={`Rated in ${size}`} />
                <Text size="small">{size}</Text>
            </div>
        ))}
    </Stack>
);

// A Reading, which has nothing behind the stars to pick and is read as one thing rather than as
// a row of them
export const ReadOnly: StoryFn<typeof Rating> = () => <Rating value={4} readOnly />;

// Standing Between Two Stars, which is what an average of many ratings usually does. Only a
// reading is drawn this way, since there is nothing there to pick a half of
export const PartialValue: StoryFn<typeof Rating> = () => (
    <div className={classes.row}>
        <Rating value={3.5} readOnly size="large" />
        <Text size="small">3.5 out of 5</Text>
    </div>
);

// Out Of However Many It Is Read Out Of, rather than the five it takes by default
export const CustomCount: StoryFn<typeof Rating> = () => (
    <Rating count={10} defaultValue={7} aria-label="Rate this article out of ten" />
);

// Disabled, which fades the whole row rather than draining it, so where it stands can still be
// read off it
export const Disabled: StoryFn<typeof Rating> = () => (
    <Stack gap="condensed">
        <Rating disabled defaultValue={3} aria-label="Rated" />
        <Rating disabled aria-label="Not yet rated" />
    </Stack>
);

// Clearable, where picking the star the rating already stands at takes it back to none
export const Clearable: StoryFn<typeof Rating> = () => {
    const [value, setValue] = React.useState(3);

    return (
        <div className={classes.row}>
            <Rating clearable value={value} onChange={setValue} aria-label="Rate this article" />
            <Text size="small">{value === 0 ? "Not rated" : `${value} out of 5`}</Text>
        </div>
    );
};

// Controlled, where the caller holds the value and shows it beside the stars
export const Controlled: StoryFn<typeof Rating> = () => {
    const [value, setValue] = React.useState(2);

    return (
        <Stack gap="condensed">
            <div className={classes.row}>
                <Rating value={value} onChange={setValue} aria-label="Rate this article" />
                <Text size="small">{value} out of 5</Text>
            </div>
            <Rating value={value} readOnly size="small" />
        </Stack>
    );
};

// Words Of Its Own, for a scale the bare count of stars would not say. The reading takes the
// same words, so what is heard of a rating is what was heard as it was given
export const CustomLabels: StoryFn<typeof Rating> = () => {
    const opinions = ["Poor", "Fair", "Good", "Very good", "Excellent"];

    return (
        <Rating
            defaultValue={4}
            aria-label="How was your stay"
            itemLabel={(value) => opinions[value - 1]}
        />
    );
};

// A Colour Of Its Own, which the filled stars are repainted in through a custom property
export const CustomColor: StoryFn<typeof Rating> = () => (
    <Rating className={classes.danger} defaultValue={2} aria-label="Rate this article" />
);

// In A Form, where the stars are submitted under a name the way a group of radios is
export const InAForm: StoryFn<typeof Rating> = () => {
    const [submitted, setSubmitted] = React.useState("Not submitted");

    return (
        <Stack
            as="form"
            gap="condensed"
            align="start"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setSubmitted(`Sent ${new FormData(event.currentTarget).get("rating")}`);
            }}
        >
            <Rating name="rating" defaultValue={3} aria-label="Rate this article" />
            <Button type="submit" size="small">
                Submit
            </Button>
            <Text size="small">{submitted}</Text>
        </Stack>
    );
};
