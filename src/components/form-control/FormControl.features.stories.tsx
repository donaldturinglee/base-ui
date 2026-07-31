import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { GlobeRegular } from "@gamecrafters/base-ui-icons";
import { Checkbox } from "../checkbox";
import { CheckboxGroup } from "../checkbox-group";
import { Radio } from "../radio";
import { RadioGroup } from "../radio-group";
import { Select } from "../select";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { Textarea } from "../textarea";
import { FormControl } from ".";

const classes = {
    stack: "flex flex-col gap-[var(--base-size-16)]",
    grid: "grid grid-cols-2 gap-[var(--base-size-16)]",
};

export default {
    title: "Components/FormControl/Features",
    parameters: {
        layout: "centered",
    },
};

// With Complex Inputs, each wired up the same way
export const WithComplexInputs: StoryFn<typeof FormControl> = () => (
    <div className={classes.grid}>
        <FormControl>
            <FormControl.Label>Text input</FormControl.Label>
            <TextInput />
        </FormControl>
        <FormControl>
            <FormControl.Label>Select</FormControl.Label>
            <Select>
                <Select.Option value="figma">Figma</Select.Option>
                <Select.Option value="css">Base CSS</Select.Option>
                <Select.Option value="react">Base React components</Select.Option>
            </Select>
        </FormControl>
        <FormControl>
            <FormControl.Label>Textarea</FormControl.Label>
            <Textarea />
        </FormControl>
        <FormControl>
            <FormControl.Label>Checkbox</FormControl.Label>
            <Checkbox />
        </FormControl>
    </div>
);

// With Custom Input, wired up by hand
export const WithCustomInput: StoryFn<typeof FormControl> = () => (
    <FormControl>
        <FormControl.Label htmlFor="custom-input">Handle</FormControl.Label>
        <input id="custom-input" type="text" aria-describedby="custom-input-caption" />
        <FormControl.Caption id="custom-input-caption">
            With or without &quot;@&quot;
        </FormControl.Caption>
    </FormControl>
);

// With Checkbox And Radio Inputs, each reading across whatever the layout
export const WithCheckboxAndRadioInputs: StoryFn<typeof FormControl> = () => (
    <div className={classes.stack}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Checkboxes</CheckboxGroup.Label>
            <FormControl>
                <Checkbox value="checkOne" />
                <FormControl.Label>Checkbox one</FormControl.Label>
            </FormControl>
            <FormControl>
                <Checkbox value="checkTwo" />
                <FormControl.Label>Checkbox two</FormControl.Label>
            </FormControl>
        </CheckboxGroup>

        <RadioGroup name="radioChoices">
            <RadioGroup.Label>Radios</RadioGroup.Label>
            <FormControl>
                <Radio value="radioOne" />
                <FormControl.Label>Radio one</FormControl.Label>
            </FormControl>
            <FormControl>
                <Radio value="radioTwo" />
                <FormControl.Label>Radio two</FormControl.Label>
            </FormControl>
        </RadioGroup>
    </div>
);

// Horizontal Layout, which reads across without a choice input asking for it
export const HorizontalLayout: StoryFn<typeof FormControl> = () => (
    <FormControl layout="horizontal">
        <TextInput />
        <FormControl.Label>Name</FormControl.Label>
        <FormControl.Caption>The name people will know you by</FormControl.Caption>
    </FormControl>
);

// Validation Example, reported as the field is typed into
export const ValidationExample: StoryFn<typeof FormControl> = () => {
    const [value, setValue] = React.useState("mona lisa");
    const hasSpaces = /\s/.test(value);

    return (
        <FormControl>
            <FormControl.Label>Handle</FormControl.Label>
            <TextInput
                block
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
            />
            {hasSpaces ? (
                <FormControl.Validation variant="error">
                    Handles cannot contain spaces
                </FormControl.Validation>
            ) : (
                <FormControl.Validation variant="success">Valid name</FormControl.Validation>
            )}
            <FormControl.Caption>With or without &quot;@&quot;</FormControl.Caption>
        </FormControl>
    );
};

// With Leading Visual, which stands between the box and its name
export const WithLeadingVisual: StoryFn<typeof FormControl> = () => (
    <div className={classes.stack}>
        <FormControl>
            <FormControl.Label>Option one</FormControl.Label>
            <FormControl.LeadingVisual>
                <GlobeRegular />
            </FormControl.LeadingVisual>
            <Checkbox />
        </FormControl>

        <FormControl>
            <FormControl.Label>Option two</FormControl.Label>
            <FormControl.LeadingVisual>
                <GlobeRegular />
            </FormControl.LeadingVisual>
            <Checkbox />
            <FormControl.Caption>This one has a caption</FormControl.Caption>
        </FormControl>

        <FormControl disabled>
            <FormControl.Label>Option three</FormControl.Label>
            <FormControl.LeadingVisual>
                <GlobeRegular />
            </FormControl.LeadingVisual>
            <Checkbox />
        </FormControl>
    </div>
);

// Disabled Inputs
export const DisabledInputs: StoryFn<typeof FormControl> = () => (
    <div className={classes.stack}>
        <FormControl disabled>
            <FormControl.Label>Disabled checkbox</FormControl.Label>
            <Checkbox />
        </FormControl>
        <FormControl disabled>
            <FormControl.Label>Disabled input</FormControl.Label>
            <TextInput />
        </FormControl>
        <FormControl disabled>
            <FormControl.Label>Disabled select</FormControl.Label>
            <Select>
                <Select.Option value="figma">Figma</Select.Option>
                <Select.Option value="css">Base CSS</Select.Option>
            </Select>
        </FormControl>
    </div>
);

// Custom Required, where the mark beside the name is worded or hidden
export const CustomRequired: StoryFn<typeof FormControl> = () => (
    <div className={classes.stack}>
        <FormControl required>
            <FormControl.Label requiredText="(required)">Name</FormControl.Label>
            <TextInput />
        </FormControl>

        <Text size="small">Required fields are marked with an asterisk (*)</Text>
        <FormControl required>
            <FormControl.Label requiredIndicator={false}>Name</FormControl.Label>
            <TextInput />
        </FormControl>

        <FormControl>
            <FormControl.Label requiredText="(optional)" requiredIndicator={false}>
                Name
            </FormControl.Label>
            <TextInput />
        </FormControl>
    </div>
);

// With Caption
export const WithCaption: StoryFn<typeof FormControl> = () => (
    <FormControl>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput />
        <FormControl.Caption>The name people will know you by</FormControl.Caption>
    </FormControl>
);

// With Caption And Disabled
export const WithCaptionAndDisabled: StoryFn<typeof FormControl> = () => (
    <FormControl disabled>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput />
        <FormControl.Caption>The name people will know you by</FormControl.Caption>
    </FormControl>
);

// With Hidden Label, which still names the input
export const WithHiddenLabel: StoryFn<typeof FormControl> = () => (
    <FormControl>
        <FormControl.Label visuallyHidden>Name</FormControl.Label>
        <TextInput />
    </FormControl>
);

// With Required Indicator
export const WithRequiredIndicator: StoryFn<typeof FormControl> = () => (
    <FormControl required>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput />
    </FormControl>
);

// With Success Validation
export const WithSuccessValidation: StoryFn<typeof FormControl> = () => (
    <FormControl required>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput defaultValue="monalisa" />
        <FormControl.Validation variant="success">That name is free</FormControl.Validation>
    </FormControl>
);

// With Error Validation
export const WithErrorValidation: StoryFn<typeof FormControl> = () => (
    <FormControl required>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput defaultValue="mona lisa" />
        <FormControl.Validation variant="error">
            Handles cannot contain spaces
        </FormControl.Validation>
    </FormControl>
);

// Label As A Span, for naming something that is not a form input
export const LabelAsSpan: StoryFn<typeof FormControl> = () => (
    <FormControl>
        <FormControl.Label as="span">Name</FormControl.Label>
        <Text>monalisa</Text>
    </FormControl>
);
