import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { NativeSelect } from ".";

const classes = {
    // Gives the block story a container to fill
    container: "w-[20rem]",
};

const choices = (
    <>
        <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
        <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
    </>
);

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
    title: "Components/NativeSelect/Features",
    parameters: {
        layout: "centered",
    },
};

// With Placeholder
export const WithPlaceholder: StoryFn<typeof NativeSelect> = () => (
    <Field id="placeholder-choice" label="Choice">
        <NativeSelect id="placeholder-choice" placeholder="Pick a choice">
            {choices}
        </NativeSelect>
    </Field>
);

// Required With Placeholder, where the placeholder cannot be chosen
export const RequiredWithPlaceholder: StoryFn<typeof NativeSelect> = () => (
    <Field id="required-choice" label="Choice">
        <NativeSelect id="required-choice" placeholder="Pick a choice" required>
            {choices}
        </NativeSelect>
    </Field>
);

// Grouped Options
export const GroupedOptions: StoryFn<typeof NativeSelect> = () => (
    <Field id="grouped-choice" label="Choice">
        <NativeSelect id="grouped-choice">
            <NativeSelect.OptGroup label="Group one">
                <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
                <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
            </NativeSelect.OptGroup>
            <NativeSelect.OptGroup label="Group two">
                <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
                <NativeSelect.Option value="four">Choice four</NativeSelect.Option>
            </NativeSelect.OptGroup>
        </NativeSelect>
    </Field>
);

// Size Scale
export const SizeScale: StoryFn<typeof NativeSelect> = () => (
    <Stack gap="normal">
        {(["small", "medium", "large"] as const).map((size) => (
            <Field key={size} id={`${size}-choice`} label={`size="${size}"`}>
                <NativeSelect id={`${size}-choice`} size={size}>
                    {choices}
                </NativeSelect>
            </Field>
        ))}
    </Stack>
);

// Block
export const Block: StoryFn<typeof NativeSelect> = () => (
    <div className={classes.container}>
        <Field id="block-choice" label="Choice">
            <NativeSelect id="block-choice" block>
                {choices}
            </NativeSelect>
        </Field>
    </div>
);

// Validation Error
export const ValidationError: StoryFn<typeof NativeSelect> = () => (
    <Field id="error-choice" label="Choice">
        <NativeSelect id="error-choice" validationStatus="error">
            {choices}
        </NativeSelect>
    </Field>
);

// Validation Success
export const ValidationSuccess: StoryFn<typeof NativeSelect> = () => (
    <Field id="success-choice" label="Choice">
        <NativeSelect id="success-choice" validationStatus="success">
            {choices}
        </NativeSelect>
    </Field>
);

// Disabled
export const Disabled: StoryFn<typeof NativeSelect> = () => (
    <Field id="disabled-choice" label="Choice">
        <NativeSelect id="disabled-choice" disabled>
            {choices}
        </NativeSelect>
    </Field>
);
