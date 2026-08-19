import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { ToggleSwitch } from ".";

const classes = {
    // The switch is named by an element beside it, so every story lays the pair out together
    row: "flex items-center justify-between gap-[var(--base-size-16)] w-[18rem]",
    // A caption sits under the label, which pushes the switch away from the label it belongs to
    caption: "flex flex-col",
};

export default {
    title: "Components/ToggleSwitch/Features",
    parameters: {
        layout: "centered",
    },
};

// Small
export const Small: StoryFn<typeof ToggleSwitch> = () => (
    <div className={classes.row}>
        <Text id="toggle" weight="semibold">
            Toggle label
        </Text>
        <ToggleSwitch size="small" aria-labelledby="toggle" />
    </div>
);

// Checked, which is a switch that starts out on
export const Checked: StoryFn<typeof ToggleSwitch> = () => (
    <div className={classes.row}>
        <Text id="toggle" weight="semibold">
            Toggle label
        </Text>
        <ToggleSwitch defaultChecked aria-labelledby="toggle" />
    </div>
);

// Disabled, which reads as unavailable while staying in the tab order so it can be explained
export const Disabled: StoryFn<typeof ToggleSwitch> = () => (
    <Stack gap="condensed">
        <div className={classes.row}>
            <Text id="toggle-off" weight="semibold">
                Off
            </Text>
            <ToggleSwitch disabled aria-labelledby="toggle-off" />
        </div>
        <div className={classes.row}>
            <Text id="toggle-on" weight="semibold">
                On
            </Text>
            <ToggleSwitch disabled defaultChecked aria-labelledby="toggle-on" />
        </div>
    </Stack>
);

// Loading, where the switch cannot be used until the value behind it has settled
export const Loading: StoryFn<typeof ToggleSwitch> = () => (
    <div className={classes.row}>
        <Text id="toggle" weight="semibold">
            Toggle label
        </Text>
        <ToggleSwitch loading aria-labelledby="toggle" />
    </div>
);

// Loading With A Delay, where the wait is only spoken of once it has gone on long enough
export const LoadingWithDelay: StoryFn<typeof ToggleSwitch> = () => {
    const [loading, setLoading] = React.useState(false);
    const [isOn, setIsOn] = React.useState(false);

    return (
        <div className={classes.row}>
            <Text id="toggle" weight="semibold">
                Enable feature
            </Text>
            <ToggleSwitch
                loading={loading}
                loadingLabel={`${isOn ? "Disabling" : "Enabling"} feature`}
                loadingLabelDelay={1000}
                aria-labelledby="toggle"
                onChange={(checked) => {
                    setIsOn(checked);
                    setLoading(true);
                    window.setTimeout(() => setLoading(false), 5000);
                }}
            />
        </div>
    );
};

// With A Caption, which the switch is described by
export const WithACaption: StoryFn<typeof ToggleSwitch> = () => (
    <div className={classes.row}>
        <div className={classes.caption}>
            <Text id="switch-label" weight="semibold">
                Notifications
            </Text>
            <Text id="switch-caption" size="small">
                Notifications will be delivered by email
            </Text>
        </div>
        <ToggleSwitch aria-labelledby="switch-label" aria-describedby="switch-caption" />
    </div>
);

// The Labels At The End, which lines the switch up against a label above it
export const LabelEnd: StoryFn<typeof ToggleSwitch> = () => (
    <div className={classes.row}>
        <Text id="toggle" weight="semibold">
            Toggle label
        </Text>
        <ToggleSwitch statusLabelPosition="end" aria-labelledby="toggle" />
    </div>
);

// With Custom Labels, where the setting has a word of its own
export const WithCustomLabels: StoryFn<typeof ToggleSwitch> = () => (
    <div className={classes.row}>
        <Text id="toggle" weight="semibold">
            Images
        </Text>
        <ToggleSwitch buttonLabelOn="Show" buttonLabelOff="Hide" aria-labelledby="toggle" />
    </div>
);

// Controlled, where the caller keeps hold of the state
export const Controlled: StoryFn<typeof ToggleSwitch> = () => {
    const [isOn, setIsOn] = React.useState(false);

    return (
        <Stack gap="condensed">
            <div className={classes.row}>
                <Text id="switch-label" weight="semibold">
                    Notifications
                </Text>
                <ToggleSwitch checked={isOn} onChange={setIsOn} aria-labelledby="switch-label" />
            </div>
            <Text size="small">The switch is {isOn ? "on" : "off"}</Text>
        </Stack>
    );
};
