import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CommandPaletteContext } from "./CommandPaletteContext";
import type { CommandPaletteListProps } from "./CommandPalette.types";

const classes = {
    // A column laid out by flex, so that the items can be put in the order they answered best
    // in without any of them being moved in the tree
    root: "flex flex-col overflow-y-auto overscroll-contain p-[var(--base-size-8)]",
};

const DEFAULT_MAX_HEIGHT = 320;

// Everything the palette is showing. It is the listbox the field is read as controlling, so it
// carries the role and the field carries the focus
function CommandPaletteList(
    props: CommandPaletteListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { maxHeight = DEFAULT_MAX_HEIGHT, className, style, children, ...rest } = props;
    const palette = React.useContext(CommandPaletteContext);

    if (!palette) {
        return null;
    }

    return (
        <div
            ref={ref}
            id={palette.listId}
            role="listbox"
            aria-labelledby={palette.labelId}
            className={classNames(classes.root, className)}
            style={{ ...style, maxHeight: `${maxHeight}px` }}
            data-component="CommandPalette.List"
            {...rest}
        >
            {children}
        </div>
    );
}

CommandPaletteList.displayName = "CommandPalette.List";

export default fixedForwardRef(CommandPaletteList);
