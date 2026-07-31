import type * as React from "react";

export type SliderSize = "small" | "medium" | "large";

// `type` is fixed, and `size` is dropped because the native attribute takes a character count
// rather than a step of the control scale. The value props are narrowed to numbers, since the
// slider has to work out from them how far along its track it stands
export type SliderProps = Omit<
    React.ComponentPropsWithoutRef<"input">,
    "type" | "size" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
> & {
    // The lowest and the highest the slider goes, and how far it moves at a time
    min?: number;
    max?: number;
    step?: number;
    // Where the slider stands, where the caller keeps hold of the value
    value?: number;
    // Where it starts out, where the slider keeps hold of the value itself
    defaultValue?: number;
    size?: SliderSize;
    // Fills the width of whatever it stands in, rather than keeping its own
    block?: boolean;
    // Called with the value the slider has moved to, and with the event that moved it
    onChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};
