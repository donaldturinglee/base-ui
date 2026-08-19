import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CommandPaletteContext } from "./CommandPaletteContext";
import type { CommandPaletteEmptyProps } from "./CommandPalette.types";

const classes = {
    root: "command-palette-empty",
};

// What stands in place of the list once what was typed has left nothing to show. It says so of
// its own accord rather than waiting to be told
function CommandPaletteEmpty(
    props: CommandPaletteEmptyProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children = "No results found", ...rest } = props;
    const palette = React.useContext(CommandPaletteContext);

    // Nothing is said until the items have had their say, so the message never shows for the
    // moment between the palette arriving and its items being counted
    if (!palette || palette.entries.length === 0 || palette.order.length > 0) {
        return null;
    }

    return (
        <div
            ref={ref}
            role="presentation"
            className={classNames(classes.root, className)}
            data-component="CommandPalette.Empty"
            {...rest}
        >
            {children}
        </div>
    );
}

CommandPaletteEmpty.displayName = "CommandPalette.Empty";

export default fixedForwardRef(CommandPaletteEmpty);
