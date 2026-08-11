import type * as React from "react";
import type { TextInputSize, TextInputValidationStatus } from "../text-input/TextInput.types";

// What the boxes will take. A numeric code turns away anything that is not a digit and asks a
// phone for its number keyboard; an alphanumeric one takes letters as well
export type PINInputType = "numeric" | "alphanumeric";

// `onChange` is dropped because the group reports the whole code rather than one box changing,
// and `defaultValue` because the code is a string rather than anything a div would hold
export type PINInputProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "onChange" | "defaultValue"
> & {
    // How many boxes the code is typed into
    length?: number;
    // The code, where the caller keeps hold of it. Box one shows its first character, box two
    // its second, and so on
    value?: string;
    // The code the boxes start out holding, where they keep hold of it themselves
    defaultValue?: string;
    type?: PINInputType;
    // Holds what has been typed back, the way a password field does
    mask?: boolean;
    size?: TextInputSize;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    validationStatus?: TextInputValidationStatus;
    // Puts the reader in the first box as the group arrives
    autoFocus?: boolean;
    // What the browser should offer to fill the code in from. It goes on the first box alone,
    // which is where a code sent by message arrives before being spread across the rest
    autoComplete?: string;
    onChange?: (value: string) => void;
    // Called once every box has been filled
    onComplete?: (value: string) => void;
    // Names each box for a screen reader, which hears "Digit 1 of 6" and so on
    boxLabel?: string;
    className?: string;
};
