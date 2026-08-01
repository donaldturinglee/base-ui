import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CommandPaletteContext } from "./CommandPaletteContext";
import type { CommandPaletteSeparatorProps } from "./CommandPalette.types";

const classes = {
    root: "my-[var(--base-size-4)] h-px shrink-0 bg-[var(--border-color-muted)]",
};

// A line between one run of items and the next. It stands down as soon as anything is typed,
// since the runs it was dividing are no longer the runs that are left
function CommandPaletteSeparator(
    props: CommandPaletteSeparatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { alwaysRender = false, className, ...rest } = props;
    const palette = React.useContext(CommandPaletteContext);

    if (!alwaysRender && palette !== null && palette.search.trim() !== "") {
        return null;
    }

    return (
        <div
            ref={ref}
            role="separator"
            className={classNames(classes.root, className)}
            data-component="CommandPalette.Separator"
            {...rest}
        />
    );
}

CommandPaletteSeparator.displayName = "CommandPalette.Separator";

export default fixedForwardRef(CommandPaletteSeparator);
