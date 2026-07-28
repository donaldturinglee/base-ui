import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import {
    CalendarLtrRegular,
    CheckmarkRegular,
    DismissCircleRegular,
    SearchRegular,
} from "@gamecrafters/base-ui-icons";
import { Stack } from "../stack";
import { Text } from "../text";
import { TextInput } from ".";

const classes = {
    // Gives the block story a container to fill
    container: "w-[25rem]",
};

const Field = ({
    id,
    label,
    children,
}: {
    id: string;
    label: string;
    children: React.ReactNode;
}) => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor={id}>
            {label}
        </Text>
        {children}
    </Stack>
);

export default {
    title: "Components/TextInput/Features",
    parameters: {
        layout: "centered",
    },
};

// Size Scale
export const SizeScale: StoryFn<typeof TextInput> = () => (
    <Stack gap="normal">
        {(["small", "medium", "large"] as const).map((size) => (
            <Field key={size} id={`${size}-name`} label={`size="${size}"`}>
                <TextInput id={`${size}-name`} size={size} placeholder="Ada Lovelace" />
            </Field>
        ))}
    </Stack>
);

// Block
export const Block: StoryFn<typeof TextInput> = () => (
    <div className={classes.container}>
        <Field id="block-name" label="Name">
            <TextInput id="block-name" block />
        </Field>
    </div>
);

// Contrast
export const Contrast: StoryFn<typeof TextInput> = () => (
    <Field id="contrast-name" label="Name">
        <TextInput id="contrast-name" contrast />
    </Field>
);

// Monospace
export const Monospace: StoryFn<typeof TextInput> = () => (
    <Field id="monospace-token" label="Token">
        <TextInput id="monospace-token" monospace defaultValue="a1b2c3d4e5f6" />
    </Field>
);

// Validation Error
export const ValidationError: StoryFn<typeof TextInput> = () => (
    <Field id="error-name" label="Name">
        <TextInput id="error-name" validationStatus="error" />
    </Field>
);

// Validation Success
export const ValidationSuccess: StoryFn<typeof TextInput> = () => (
    <Field id="success-name" label="Name">
        <TextInput id="success-name" validationStatus="success" />
    </Field>
);

// Disabled
export const Disabled: StoryFn<typeof TextInput> = () => (
    <Field id="disabled-name" label="Name">
        <TextInput id="disabled-name" disabled defaultValue="You cannot change this" />
    </Field>
);

// With A Leading Visual, given either as a component or as plain text
export const WithALeadingVisual: StoryFn<typeof TextInput> = () => (
    <Stack gap="normal">
        <Field id="leading-search" label="Search">
            <TextInput id="leading-search" leadingVisual={SearchRegular} />
        </Field>
        <Field id="leading-amount" label="Amount">
            <TextInput id="leading-amount" leadingVisual="$" placeholder="0.00" />
        </Field>
    </Stack>
);

// With A Trailing Visual
export const WithATrailingVisual: StoryFn<typeof TextInput> = () => (
    <Stack gap="normal">
        <Field id="trailing-name" label="Name">
            <TextInput id="trailing-name" trailingVisual={CheckmarkRegular} />
        </Field>
        <Field id="trailing-duration" label="Duration">
            <TextInput id="trailing-duration" trailingVisual="minutes" placeholder="20" />
        </Field>
    </Stack>
);

// With Both Visuals
export const WithBothVisuals: StoryFn<typeof TextInput> = () => (
    <Field id="both-when" label="When">
        <TextInput
            id="both-when"
            leadingVisual={CalendarLtrRegular}
            trailingVisual={CheckmarkRegular}
        />
    </Field>
);

// With A Trailing Action, which clears what has been typed
export const WithATrailingAction: StoryFn<typeof TextInput> = () => {
    const [value, setValue] = React.useState("sample text");

    return (
        <Field id="action-name" label="Name">
            <TextInput
                id="action-name"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                trailingAction={
                    value ? (
                        <TextInput.Action
                            icon={DismissCircleRegular}
                            aria-label="Clear the field"
                            onClick={() => setValue("")}
                        />
                    ) : null
                }
            />
        </Field>
    );
};

// Loading, where the spinner stands at whichever end the caller asks for
export const Loading: StoryFn<typeof TextInput> = () => (
    <Stack gap="normal">
        {(["auto", "leading", "trailing"] as const).map((position) => (
            <Field key={position} id={`loading-${position}`} label={`loaderPosition="${position}"`}>
                <TextInput id={`loading-${position}`} loading loaderPosition={position} />
            </Field>
        ))}
    </Stack>
);

// Loading With A Leading Visual, which the spinner takes the place of
export const LoadingWithALeadingVisual: StoryFn<typeof TextInput> = () => (
    <Stack gap="normal">
        {(["auto", "leading", "trailing"] as const).map((position) => (
            <Field
                key={position}
                id={`loading-visual-${position}`}
                label={`loaderPosition="${position}"`}
            >
                <TextInput
                    id={`loading-visual-${position}`}
                    leadingVisual={CalendarLtrRegular}
                    loading
                    loaderPosition={position}
                />
            </Field>
        ))}
    </Stack>
);

// Character Limit, which counts down and reports an error once it is passed
export const CharacterLimit: StoryFn<typeof TextInput> = () => (
    <Field id="limit-username" label="Username">
        <TextInput id="limit-username" characterLimit={20} />
    </Field>
);

// Character Limit Passed
export const CharacterLimitPassed: StoryFn<typeof TextInput> = () => (
    <Field id="over-username" label="Username">
        <TextInput
            id="over-username"
            characterLimit={10}
            defaultValue="This is rather longer than the limit allows"
        />
    </Field>
);
