import type * as React from "react";

export type ToggleSwitchSize = "small" | "medium";

export type ToggleSwitchStatusLabelPosition = "start" | "end";

export type ToggleSwitchButtonType = "button" | "submit" | "reset";

export type ToggleSwitchProps = Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> & {
    // The id of the element that names the switch
    "aria-labelledby": string;
    // Whether the switch is on, where the caller keeps hold of the state
    checked?: boolean;
    // Whether the switch starts out on, where the switch keeps hold of the state itself
    defaultChecked?: boolean;
    // Stops the switch being used, while leaving it in the tab order so it can be explained
    disabled?: boolean;
    // Whether the value behind the switch is still being worked out
    loading?: boolean;
    onChange?: (checked: boolean) => void;
    onClick?: React.MouseEventHandler;
    size?: ToggleSwitchSize;
    // Which side of the switch the on and off labels sit on. Only worth changing where the
    // switch has to line up with a label above it and a caption below
    statusLabelPosition?: ToggleSwitchStatusLabelPosition;
    // How long the switch waits before a reader is told that it is loading
    loadingLabelDelay?: number;
    // What a reader hears once the switch has been loading for that long
    loadingLabel?: string;
    // Which kind of button the switch is, for when it sits in a form
    buttonType?: ToggleSwitchButtonType;
    // What the switch says when it is on. Only worth changing where the setting has a word of
    // its own, such as "Show" for showing images
    buttonLabelOn?: string;
    buttonLabelOff?: string;
    className?: string;
};
