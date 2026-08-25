import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonSize, ButtonVariant } from "../button";
import type { TextInputProps } from "../text-input/TextInput.types";

// What the clipboard holds and how long it holds it for. The clipboard and the hook behind it
// are given the value the same way, so a copy control built by hand and one built from the parts
// are set up alike
type ClipboardStoreProps = {
    // The text the clipboard is given, where the caller keeps hold of it
    value?: string;
    // The text it starts out holding, where the clipboard keeps hold of it itself
    defaultValue?: string;
    // How long the tick stands before the trigger goes back to offering a copy. Nought leaves it
    // standing until the value is copied again
    timeout?: number;
    // Stops the value being copied
    disabled?: boolean;
};

type ClipboardCallbacks = {
    // Called with the text the clipboard now holds
    onValueChange?: (value: string) => void;
    // Called with whether the value has just been copied: true as it is taken, and false again
    // once the tick has stood long enough
    onStatusChange?: (copied: boolean) => void;
    // Called where the clipboard could not be reached: a page that was refused it, or a reader
    // who turned the prompt down
    onCopyError?: (error: unknown) => void;
};

export type UseClipboardProps = ClipboardStoreProps & ClipboardCallbacks;

export type UseClipboardReturn = {
    // The text that would go to the clipboard were it copied now
    value: string;
    // Whether it has just been copied, and the tick is still standing
    copied: boolean;
    disabled: boolean;
    // Puts the value on the clipboard
    copy: () => void;
    // Changes the text held
    setValue: (value: string) => void;
};

type ClipboardOwnProps = ClipboardStoreProps & {
    // What a screen reader is told once the value has been copied. A trigger named for what
    // pressing it does says nothing about what it did, so this is what reports it; `null` where
    // something else on the row already does, a Clipboard.CopyText say
    copiedAnnouncement?: string | null;
    className?: string;
};

export type ClipboardProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    ClipboardOwnProps
> &
    ClipboardCallbacks;

// The same props at the element a clipboard renders by default, for reading inside the component
export type ClipboardElementProps = ClipboardProps<"div">;

// What the value and the trigger stand in together, so that they read across as one row however
// the name above them is laid out
export type ClipboardControlProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type ClipboardLabelProps<As extends React.ElementType = "label"> = PolymorphicProps<
    As,
    "label",
    {
        className?: string;
    }
>;

// The field only ever shows the value the clipboard was given, so there is nothing for a caller
// to put in it or to hear back from it
export type ClipboardInputProps = Omit<
    TextInputProps,
    "value" | "defaultValue" | "onChange" | "readOnly" | "type"
>;

// A trigger given nothing to say is drawn as an icon button, which carries no words of its own,
// so `label` is what names it. One given children takes its name from those, the way any other
// button does, and there is nothing left for `label` to do
export type ClipboardTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "type" | "aria-label" | "aria-labelledby"
> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    // What an icon-only trigger is called
    label?: string;
    className?: string;
};

export type ClipboardIndicatorProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        // What stands there once the value has been copied. Given nothing, a tick
        copied?: React.ReactNode;
        className?: string;
    }
>;

export type ClipboardValueTextProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        className?: string;
    }
>;

export type ClipboardCopyTextProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        // What it says once the value has been copied. Given nothing, "Copied"
        copied?: React.ReactNode;
        // Leaves the words to a screen reader alone, for a trigger drawn as an icon that still
        // has to carry a name
        visuallyHidden?: boolean;
        className?: string;
    }
>;

export type ClipboardContextValue = {
    value?: string;
    // Whether the value has just been copied, and the tick is still standing
    copied?: boolean;
    disabled?: boolean;
    // The field showing the value, so that the name above it has something to point at. The field
    // is the one that decides, since it is the one that may have been given an id of its own or
    // taken one from the form control it stands in
    inputId?: string;
    setInputId?: (id: string | undefined) => void;
    // Puts the value on the clipboard
    copy?: () => void;
    // Changes the text the clipboard holds
    setValue?: (value: string) => void;
};
