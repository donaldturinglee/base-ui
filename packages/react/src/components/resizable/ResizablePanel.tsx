import * as React from "react";
import { Panel } from "react-resizable-panels";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ResizablePanelProps } from "./Resizable.types";

const classes = {
    root: "resizable-panel",
};

// One of the panels the group is divided into. How much room it starts with, and how little or
// how much it will take, are said here rather than by the group, so a panel carries its own
// bounds wherever it is put.
//
// A size given as a number is read as pixels and one given as a string without units as a share of
// the group; anything else is read as the unit it ends with, so "20rem" and "50%" both say what
// they look like they say.
//
// The class lands on the box the panel's content is drawn in rather than on the panel itself,
// which is laid out by the group and cannot be given a size of its own without unsettling it
function ResizablePanel(
    props: ResizablePanelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <Panel
            elementRef={ref}
            className={classNames(classes.root, className)}
            data-component="Resizable.Panel"
            {...rest}
        />
    );
}

ResizablePanel.displayName = "Resizable.Panel";

export default fixedForwardRef(ResizablePanel);
