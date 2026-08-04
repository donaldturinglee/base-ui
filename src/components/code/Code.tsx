import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CodeProps } from "./Code.types";

const classes = {
    root: "code",
};

// A name, a command or a fragment of source read inside a line of prose, set in a monospaced
// face and on a ground of its own so that it is told apart from the words around it. Nothing
// here is asked about the size, which is given in em and so follows whatever line the code is
// read in rather than setting one against it.
//
// What is answered here is the one fragment and the line it is read in. A listing set apart
// from the text, with its line breaks and its indentation kept as they were written, is not
// what this is for, and neither is anything that wants a grammar read over it
function Code<As extends React.ElementType = "code">(
    props: CodeProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "code", className, ...rest } = props as CodeProps<"code">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Code"
            {...rest}
        />
    );
}

Code.displayName = "Code";

export default fixedForwardRef(Code);
