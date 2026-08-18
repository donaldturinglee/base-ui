import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ComboboxContentProps } from "./Combobox.types";

const classes = {
    root: "combobox-content",
};

// The surface the list is drawn on. It never takes focus: the field keeps the caret throughout,
// so this is only ever somewhere for the list and whatever stands beside it to be laid out
function ComboboxContent(
    props: ComboboxContentProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Combobox.Content"
            {...rest}
        >
            {children}
        </div>
    );
}

ComboboxContent.displayName = "Combobox.Content";

export default fixedForwardRef(ComboboxContent);
