import type { TextInputProps } from "../text-input/TextInput.types";

// The field is a text input told to hold a password, so everything that shapes a text input
// shapes this one too. The type is taken over because that is what holds the password back, and
// the trailing action because the toggle stands there
export type PasswordInputProps = Omit<TextInputProps, "type" | "trailingAction"> & {
    // Whether what has been typed is being shown, where the caller keeps hold of that
    visible?: boolean;
    // Whether it starts out shown, where the field keeps hold of that itself
    defaultVisible?: boolean;
    onVisibilityChange?: (visible: boolean) => void;
    // Leaves the field with no way to show what has been typed
    hideToggle?: boolean;
    // The toggle carries an icon rather than words, so each of the two things it can do next has
    // to be named for a screen reader
    showLabel?: string;
    hideLabel?: string;
    className?: string;
};
