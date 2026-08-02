import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Spinner } from "../spinner";
import type { CommandPaletteLoadingProps } from "./CommandPalette.types";

const classes = {
    // The same box the message stands in, so what is being waited on and what came back of it
    // take up the same room
    root: "grid h-[var(--base-size-64)] shrink-0 place-items-center px-[var(--base-size-8)]",
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
