import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonSize, ButtonVariant } from "../button";
import type { TextInputProps } from "../text-input/TextInput.types";

type ClipboardTextOwnProps = {
    // The text the clipboard is given
    value: string;
    // How long the tick stands before the trigger goes back to offering a copy. Nought leaves it
    // standing until the value is copied again
    timeout?: number;
    // Stops the value being copied
    disabled?: boolean;
    // What a screen reader is told once the value has been copied. The trigger is named for what
    // pressing it does rather than for what it did, so this is what says anything happened at all
    copiedAnnouncement?: string;
    className?: string;
};

type ClipboardTextCallbacks = {
    // Called with the text that reached the clipboard
    onCopy?: (value: string) => void;
    // Called where it could not be reached: a page that was refused the clipboard, or a reader
    // who turned the prompt down
    onCopyError?: (error: unknown) => void;
};

// The native `onCopy` is dropped so it cannot intersect with the component's own, which reports
// the text that was put on the clipboard rather than a copy the reader made from the page
export type ClipboardTextProps<As extends React.ElementType = "div"> = Omit<
    PolymorphicProps<As, "div", ClipboardTextOwnProps>,
    "onCopy"
> &
    ClipboardTextCallbacks;

// The same props at the element a clipboard renders by default, for reading inside the component
export type ClipboardTextElementProps = ClipboardTextProps<"div">;

// The field only ever shows the value the clipboard was given, so there is nothing for a caller
// to put in it or to hear back from it
export type ClipboardTextInputProps = Omit<
    TextInputProps,
    "value" | "defaultValue" | "onChange" | "readOnly" | "type"
>;

// A trigger given nothing to say is drawn as an icon button, which carries no words of its own,
// so `label` is what names it. One given children takes its name from those, the way any other
// button does, and there is nothing left for `label` to do
export type ClipboardTextTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "type" | "aria-label" | "aria-labelledby"
> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    // What an icon-only trigger is called
    label?: string;
    className?: string;
};

export type ClipboardTextIndicatorProps = React.SVGAttributes<SVGSVGElement> & {
    // What stands there while the value is waiting to be copied
    copyIcon?: React.ElementType;
    // And what takes its place once it has been
    copiedIcon?: React.ElementType;
    className?: string;
};

export type ClipboardTextContextValue = {
    value?: string;
    // Whether the value has just been copied, and the tick is still standing
    copied?: boolean;
    disabled?: boolean;
    // Puts the value on the clipboard
    copy?: () => void;
    inputId?: string;
};
