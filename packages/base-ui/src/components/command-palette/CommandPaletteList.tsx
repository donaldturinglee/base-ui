import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CommandPaletteContext } from "./CommandPaletteContext";
import type { CommandPaletteListProps } from "./CommandPalette.types";

const classes = {
    root: "command-palette-list",
};

const DEFAULT_MAX_HEIGHT = 400;

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
