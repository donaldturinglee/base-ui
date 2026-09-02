import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { FormControl } from "../form-control";
import { Stack } from "../stack";
import { Text } from "../text";
import { Switch, useSwitch } from ".";

export default {
    title: "Components/Switch/Features",
    parameters: {
        layout: "centered",
    },
};

// Initial Checked, which is a switch that starts out on
export const InitialChecked: StoryFn<typeof Switch> = () => (
    <Switch defaultChecked>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.HiddenInput />
    </Switch>
);

// Controlled, where the caller keeps hold of the state and shows it beside the switch
export const Controlled: StoryFn<typeof Switch> = () => {
    const [checked, setChecked] = React.useState(false);

    return (
        <Stack gap="condensed" align="start">
            <Switch checked={checked} onCheckedChange={setChecked}>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Notifications</Switch.Label>
                <Switch.HiddenInput />
            </Switch>
            <Text size="small">Notifications are {checked ? "on" : "off"}</Text>
        </Stack>
    );
};

// Disabled, which cannot be turned and is not submitted, off and on
export const Disabled: StoryFn<typeof Switch> = () => (
    <Stack gap="condensed" align="start">
        <Switch disabled>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>Off</Switch.Label>
            <Switch.HiddenInput />
        </Switch>
        <Switch disabled defaultChecked>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>On</Switch.Label>
            <Switch.HiddenInput />
        </Switch>
    </Stack>
);

// Read Only, which is left where it stands while staying in the tab order, so it can still be
// reached and read, and is still submitted
export const ReadOnly: StoryFn<typeof Switch> = () => (
    <Switch readOnly defaultChecked>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.HiddenInput />
    </Switch>
);

// Invalid, for a setting that will not do as it stands
export const Invalid: StoryFn<typeof Switch> = () => (
    <Switch invalid>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.HiddenInput />
    </Switch>
);

// Label First, where the words come before the track. The parts stand in the order they are
// written, so it is only a matter of writing them the other way round
export const LabelFirst: StoryFn<typeof Switch> = () => (
    <Switch>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.HiddenInput />
    </Switch>
);

// Root Provider, where the switch is drawn from a hook the caller is holding, so it can be turned
// from somewhere else on the page as well as from the switch itself
export const RootProvider: StoryFn<typeof Switch> = () => {
    const notifications = useSwitch({ defaultChecked: true });

    return (
        <Stack gap="condensed" align="start">
            <Switch.RootProvider value={notifications}>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Notifications</Switch.Label>
                <Switch.HiddenInput />
            </Switch.RootProvider>
            <Button size="small" onClick={notifications.toggleChecked}>
                Toggle
            </Button>
        </Stack>
    );
};

// In A Form Control, which describes the switch by its caption and its validation message, and
// says for it whether it is required or disabled
export const InFormControl: StoryFn<typeof Switch> = () => (
    <FormControl required>
        <Switch invalid>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>Notifications</Switch.Label>
            <Switch.HiddenInput />
        </Switch>
        <FormControl.Validation variant="error">
            Notifications have to be on to be told about a match
        </FormControl.Validation>
        <FormControl.Caption>Sent by email, once a day</FormControl.Caption>
    </FormControl>
);

// In A Form, where the switch is submitted under its name while it is on, and taken back to
// where it started by a reset
export const InAForm: StoryFn<typeof Switch> = () => {
    const [submitted, setSubmitted] = React.useState("Not submitted");

    return (
        <Stack
            as="form"
            gap="condensed"
            align="start"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setSubmitted(
                    `Sent ${new FormData(event.currentTarget).get("notifications") ?? "nothing"}`,
                );
            }}
        >
            <Switch name="notifications" value="email" defaultChecked>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Notifications</Switch.Label>
                <Switch.HiddenInput />
            </Switch>
            <Stack direction="horizontal" gap="condensed">
                <Button type="submit" size="small">
                    Submit
                </Button>
                <Button type="reset" size="small">
                    Reset
                </Button>
            </Stack>
            <Text size="small">{submitted}</Text>
        </Stack>
    );
};
