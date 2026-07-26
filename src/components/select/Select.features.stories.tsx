import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Select } from ".";

const classes = {
    // Gives the block story a container to fill
    container: "w-[20rem]",
};

const choices = (
    <>
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>
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
    title: "Components/Select/Features",
    parameters: {
        layout: "centered",
    },
};

// With Placeholder
export const WithPlaceholder: StoryFn<typeof Select> = () => (
    <Field id="placeholder-choice" label="Choice">
        <Select id="placeholder-choice" placeholder="Pick a choice">
            {choices}
        </Select>
    </Field>
);

// Required With Placeholder, where the placeholder cannot be chosen
export const RequiredWithPlaceholder: StoryFn<typeof Select> = () => (
    <Field id="required-choice" label="Choice">
        <Select id="required-choice" placeholder="Pick a choice" required>
            {choices}
        </Select>
    </Field>
);

// Grouped Options
export const GroupedOptions: StoryFn<typeof Select> = () => (
    <Field id="grouped-choice" label="Choice">
        <Select id="grouped-choice">
            <Select.OptGroup label="Group one">
                <Select.Option value="one">Choice one</Select.Option>
                <Select.Option value="two">Choice two</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Group two">
                <Select.Option value="three">Choice three</Select.Option>
                <Select.Option value="four">Choice four</Select.Option>
            </Select.OptGroup>
        </Select>
    </Field>
);

// Size Scale
export const SizeScale: StoryFn<typeof Select> = () => (
    <Stack gap="normal">
        {(["small", "medium", "large"] as const).map((size) => (
            <Field key={size} id={`${size}-choice`} label={`size="${size}"`}>
                <Select id={`${size}-choice`} size={size}>
                    {choices}
                </Select>
            </Field>
        ))}
    </Stack>
);

// Block
export const Block: StoryFn<typeof Select> = () => (
    <div className={classes.container}>
        <Field id="block-choice" label="Choice">
            <Select id="block-choice" block>
                {choices}
            </Select>
        </Field>
    </div>
);

// Validation Error
export const ValidationError: StoryFn<typeof Select> = () => (
    <Field id="error-choice" label="Choice">
        <Select id="error-choice" validationStatus="error">
            {choices}
        </Select>
    </Field>
);

// Validation Success
export const ValidationSuccess: StoryFn<typeof Select> = () => (
    <Field id="success-choice" label="Choice">
        <Select id="success-choice" validationStatus="success">
            {choices}
        </Select>
    </Field>
);

// Disabled
export const Disabled: StoryFn<typeof Select> = () => (
    <Field id="disabled-choice" label="Choice">
        <Select id="disabled-choice" disabled>
            {choices}
        </Select>
    </Field>
);
