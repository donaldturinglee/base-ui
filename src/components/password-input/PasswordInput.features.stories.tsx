import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { LockClosedRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { FormControl } from "../form-control";
import { Text } from "../text";
import { PasswordInput } from ".";
import type { TextInputSize } from "../text-input/TextInput.types";

const classes = {
    // Gives the fields a container to lay themselves out against
    container: "w-[20rem]",
    // Sets one field apart from the next where several are shown together
    stack: "flex flex-col gap-[var(--base-size-16)]",
    row: "flex items-center gap-[var(--base-size-8)]",
    muted: "text-[var(--foreground-color-muted)]",
};

const sizes: TextInputSize[] = ["small", "medium", "large"];

export default {
    title: "Components/PasswordInput/Features",
};

// Showing What Has Been Typed From The Start, for a field a reader has asked to be able to read
export const StartingShown: StoryFn<typeof PasswordInput> = () => (
    <div className={classes.container}>
        <PasswordInput aria-label="Password" defaultValue="correct horse battery" defaultVisible />
    </div>
);

// The Sizes A Field Comes In, which the toggle is sized to match
export const Sizes: StoryFn<typeof PasswordInput> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        {sizes.map((size) => (
            <PasswordInput key={size} aria-label={size} size={size} defaultValue="hunter2" />
        ))}
    </div>
);

// With A Mark Leading It, which the field carries the way any other field carries a visual
export const WithALeadingVisual: StoryFn<typeof PasswordInput> = () => (
    <div className={classes.container}>
        <PasswordInput
            aria-label="Password"
            leadingVisual={LockClosedRegular}
            autoComplete="current-password"
        />
    </div>
);

// Without The Toggle, for a field on a screen where nothing typed into it should be shown at all
export const WithoutTheToggle: StoryFn<typeof PasswordInput> = () => (
    <div className={classes.container}>
        <PasswordInput aria-label="Password" hideToggle autoComplete="current-password" />
    </div>
);

// Validation Statuses, drawn on the field the way they are on any other
export const ValidationStatuses: StoryFn<typeof PasswordInput> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <PasswordInput aria-label="Too short" defaultValue="abc" validationStatus="error" />
        <PasswordInput aria-label="Long enough" defaultValue="hunter2" validationStatus="success" />
    </div>
);

// Turned Off, which closes the toggle along with the field
export const Disabled: StoryFn<typeof PasswordInput> = () => (
    <div className={classes.container}>
        <PasswordInput aria-label="Password" defaultValue="hunter2" disabled />
    </div>
);

// On A Form, where the field is named and told what the browser should fill it with
export const OnAForm: StoryFn<typeof PasswordInput> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <FormControl>
            <FormControl.Label>Current password</FormControl.Label>
            <PasswordInput name="current" autoComplete="current-password" />
        </FormControl>

        <FormControl>
            <FormControl.Label>New password</FormControl.Label>
            <PasswordInput name="new" autoComplete="new-password" />
            <FormControl.Caption>At least twelve characters</FormControl.Caption>
        </FormControl>
    </div>
);

// Controlled, where the caller keeps hold of whether the password is shown. Both fields are held
// by the one answer, so a reader who asks to see one is shown both rather than having to ask
// twice
export const Controlled: StoryFn<typeof PasswordInput> = () => {
    const [visible, setVisible] = React.useState(false);

    return (
        <div className={`${classes.container} ${classes.stack}`}>
            <PasswordInput
                aria-label="Password"
                defaultValue="hunter2"
                visible={visible}
                onVisibilityChange={setVisible}
            />
            <PasswordInput
                aria-label="Confirm password"
                defaultValue="hunter2"
                visible={visible}
                onVisibilityChange={setVisible}
            />

            <div className={classes.row}>
                <Button onClick={() => setVisible((current) => !current)}>
                    {visible ? "Hide both" : "Show both"}
                </Button>
                <Text size="small" className={classes.muted}>
                    {visible ? "Shown" : "Hidden"}
                </Text>
            </div>
        </div>
    );
};
