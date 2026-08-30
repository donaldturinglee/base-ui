import * as React from "react";
import { Group } from "react-resizable-panels";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ResizableProps } from "./Resizable.types";

const classes = {
    root: "resizable",
};

// A row or a column of panels with a handle between each pair, which a reader drags to give room
// to one panel by taking it from the next.
//
// The panels are laid out within whatever room the group is given rather than within a size of
// its own, so it has to be given some: standing in a box of no height it draws nothing. Where the
// panels come to rest is settled by the panels themselves, each of which says how much room it
// starts with and how little or how much it will take
function Resizable(
    props: ResizableProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, orientation = "horizontal", resizableRef, ...rest } = props;

    return (
        <Group
            elementRef={ref}
            groupRef={resizableRef}
            orientation={orientation}
            className={classNames(classes.root, className)}
            data-component="Resizable"
            data-orientation={orientation}
            {...rest}
        />
    );
}

Resizable.displayName = "Resizable";

export default fixedForwardRef(Resizable);
