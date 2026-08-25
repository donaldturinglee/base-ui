import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ClipboardContext } from "./ClipboardContext";
import type { ClipboardValueTextProps } from "./Clipboard.types";

const classes = {
    root: "clipboard-value-text",
};

// The value shown as text rather than in a field, for a row where it is there to be recognised
// rather than read to the end or taken by hand. A caller who would rather show something else,
// a shortened form of the value say, puts that in as children and the value goes on being what
// is copied
function ClipboardValueText<As extends React.ElementType = "span">(
    props: ClipboardValueTextProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        children,
        ...rest
    } = props as ClipboardValueTextProps<"span">;
    const { value, copied } = React.useContext(ClipboardContext);

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Clipboard.ValueText"
            data-copied={Boolean(copied)}
            {...rest}
        >
            {children ?? value}
        </Component>
    );
}

ClipboardValueText.displayName = "Clipboard.ValueText";

export default fixedForwardRef(ClipboardValueText);
