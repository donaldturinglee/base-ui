import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ResizableContext } from "./ResizableContext";
import { useResizable } from "./useResizable";
import type { ResizableInstance, ResizableProps } from "./Resizable.types";

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
    const {
        className,
        orientation = "horizontal",
        disabled = false,
        disableCursor = false,
        defaultLayout,
        onLayoutChange,
        onLayoutChanged,
        resizableRef,
        children,
        ...rest
    } = props;

    const resizable = useResizable({
        orientation,
        disabled,
        disableCursor,
        defaultLayout,
        onLayoutChange,
        onLayoutChanged,
    });

    const mergedRef = useMergedRefs(ref, resizable.groupRef);

    // What the group can be asked to do from outside it. It is handed over through a ref of its
    // own rather than through the one that lands on the element, since a caller reaching for the
    // element and one reaching for the layout are asking for two different things
    React.useImperativeHandle(
        resizableRef,
        (): ResizableInstance => ({
            getLayout: resizable.getLayout,
            setLayout: resizable.setLayout,
        }),
        [resizable.getLayout, resizable.setLayout],
    );

    return (
        <ResizableContext.Provider value={resizable}>
            <div
                ref={mergedRef}
                className={classNames(classes.root, className)}
                data-component="Resizable"
                data-orientation={orientation}
                data-disabled={disabled || undefined}
                data-cursor={disableCursor ? "none" : undefined}
                {...rest}
            >
                {children}
            </div>
        </ResizableContext.Provider>
    );
}

Resizable.displayName = "Resizable";

export default fixedForwardRef(Resizable);
