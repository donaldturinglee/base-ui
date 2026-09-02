import type * as React from "react";

// The ids the parts are named by. Each is worked out from the switch's own id where it is not
// given, so they are only worth giving where something outside the switch has to point at a part
// by name
export type SwitchIds = {
    root?: string;
    label?: string;
    control?: string;
    thumb?: string;
    hiddenInput?: string;
};

// What a switch is told and what it holds. The switch and the hook behind it are given the state
// the same way, so a switch built by hand from the hook and one built from the parts are set up
// alike
export type UseSwitchProps = {
    // Whether the switch is on, where the caller keeps hold of the state
    checked?: boolean;
    // Whether it starts out on, where the switch keeps hold of the state itself
    defaultChecked?: boolean;
    // Stops the switch being turned, and takes it out of the tab order the way a disabled input
    // is. What it holds is not submitted
    disabled?: boolean;
    // Leaves the switch where it stands while keeping it in the tab order, so it can still be
    // reached and read. What it holds is still submitted
    readOnly?: boolean;
    // Whether the switch has to be on before the owning form can be submitted
    required?: boolean;
    // Marks the switch as holding a value that will not do
    invalid?: boolean;
    // The name the value is submitted under
    name?: string;
    // What is submitted while the switch is on. The browser sends "on" where none is given
    value?: string | number;
    // The form the switch belongs to, where it does not stand inside it
    form?: string;
    // Names the switch, and with it the parts, which are named from it. One is made where the
    // caller does not give one
    id?: string;
    ids?: SwitchIds;
    // Called with whether the switch is on whenever it is turned on or off
    onCheckedChange?: (checked: boolean) => void;
};

export type UseSwitchReturn = {
    // Whether the switch is on
    checked: boolean;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    invalid: boolean;
    name?: string;
    value?: string | number;
    form?: string;
    // The ids every part is named by, settled once here so that the root can point at the input
    // and the input can name itself by the label without either having been told the other's
    ids: Required<SwitchIds>;
    // What describes the switch to a screen reader: the caption and the validation message of
    // the field it stands in, where it stands in one
    describedBy?: string;
    // Turns the switch on or off
    setChecked: (checked: boolean) => void;
    // Turns it the other way from where it stands
    toggleChecked: () => void;
};

// The switch is a label underneath, so the whole of it is a target for the input it holds. What
// the label would take of its own that the switch settles for it is left off
export type SwitchProps = Omit<
    React.ComponentPropsWithoutRef<"label">,
    keyof UseSwitchProps | "htmlFor"
> &
    UseSwitchProps & {
        className?: string;
    };

// The same switch, handed the state a hook of the caller's own is holding rather than working it
// out from props of its own
export type SwitchRootProviderProps = Omit<
    React.ComponentPropsWithoutRef<"label">,
    "htmlFor" | "defaultChecked"
> & {
    value: UseSwitchReturn;
    className?: string;
};

export type SwitchControlProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type SwitchThumbProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type SwitchLabelProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

// Whether the input is on is the switch's to say, so what would set it on the input is left off
export type SwitchHiddenInputProps = Omit<
    React.ComponentPropsWithoutRef<"input">,
    "type" | "checked" | "defaultChecked"
> & {
    className?: string;
};

// What the parts read off the switch around them
export type SwitchContextValue = Partial<UseSwitchReturn> & {
    // Where the switch started out, which is where a form that is reset takes it back to
    initialChecked?: boolean;
};
