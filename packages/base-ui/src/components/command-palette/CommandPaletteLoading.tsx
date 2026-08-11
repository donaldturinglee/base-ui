import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Spinner } from "../spinner";
import type { CommandPaletteLoadingProps } from "./CommandPalette.types";

const classes = {
    root: "command-palette-loading",
};

// Stands in place of the list while the palette is waiting on items it has to fetch. It is
// the caller's to render or not, since only they know whether anything is still on its way
function CommandPaletteLoading(
    props: CommandPaletteLoadingProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { label = "Loading", className, children, ...rest } = props;

    return (
        <div
            ref={ref}
            role="presentation"
            className={classNames(classes.root, className)}
            data-component="CommandPalette.Loading"
            {...rest}
        >
            {children ?? <Spinner size="small" srText={label} />}
        </div>
    );
}

CommandPaletteLoading.displayName = "CommandPalette.Loading";

export default fixedForwardRef(CommandPaletteLoading);
