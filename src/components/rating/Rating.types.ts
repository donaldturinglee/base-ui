import type * as React from "react";

export type RatingSize = "small" | "medium" | "large";

// `onChange` is narrowed to the star the rating has moved to, and `defaultValue` to a number,
// since the rating has to work out from it how much of each star is filled
export type RatingProps = Omit<
    React.ComponentPropsWithoutRef<"span">,
    "onChange" | "defaultValue"
> & {
    // How many stars the rating is read out of
    count?: number;
    // Which star the rating stands at, where the caller keeps hold of the value
    value?: number;
    // Which one it starts out at, where the rating keeps hold of the value itself
    defaultValue?: number;
    size?: RatingSize;
    // A reading rather than a control. The stars are drawn without the radios behind them, so a
    // value standing between two of them is left standing there rather than rounded to the
    // nearer one
    readOnly?: boolean;
    // Stops the rating being moved, and takes it out of the tab order the way a disabled radio
    // is. Only worth using where the rating is to be shown as a control that is not available
    // just now; a reading that was never a control is better off read-only
    disabled?: boolean;
    // Lets the star the rating already stands at be picked again to clear it back to none
    clearable?: boolean;
    // What the browser groups the stars under, and the name the value is submitted with. One is
    // made up where none is given, since a radio without a name is a group of its own
    name?: string;
    // Called with the star the rating has moved to, which is nought where it has been cleared
    onChange?: (value: number) => void;
    // What a screen reader hears for each star it moves through
    itemLabel?: (value: number, count: number) => string;
    // What it hears for a reading, which is read as one thing rather than as a row of stars
    valueLabel?: (value: number, count: number) => string;
    className?: string;
};
