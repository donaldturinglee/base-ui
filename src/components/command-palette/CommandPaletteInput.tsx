import * as React from "react";
import { SearchRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TextInput } from "../text-input";
import { CommandPaletteContext } from "./CommandPaletteContext";
import type { CommandPaletteInputProps } from "./CommandPalette.types";

const classes = {
    // The field stands on the panel rather than being the top of it: a margin holds it off
    // the top and either side, and a background of its own sets it apart from what it is
    // standing on, so it reads as the one thing there to be typed into. Nothing is set under
    // it, since the list below carries padding of its own that already holds the two apart.
    // It is left to stretch to the panel rather than told to fill it: a field given the
    // whole width would take that and its margins besides, and the panel would clip what ran
    // past its end, leaving the far margin nowhere to be seen. Its corners are its own now
    // that the panel's are no longer what clips it, but it gives up its border and its ring
    // alike, since the background is what marks it out. It is set larger and taller than an
    // ordinary field, and its padding stands inside its margin far enough that the magnifier
    // still starts where the headings and the items below it start, so the whole panel reads
    // down one edge
    root: "command-palette-input",
};

// What the palette is narrowed by. It keeps focus the whole time the palette is open and
// points at whichever item is in hand, so the arrows run down the list without focus leaving it
function CommandPaletteInput(
    props: CommandPaletteInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, placeholder = "Type a command or search", ...rest } = props;
    const palette = React.useContext(CommandPaletteContext);

    if (!palette) {
        return null;
    }

    return (
        <TextInput
            ref={ref}
            type="text"
            size="large"
            block
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls={palette.listId}
            aria-labelledby={palette.labelId}
            aria-activedescendant={palette.activeId}
            autoComplete="off"
            leadingVisual={SearchRegular}
            placeholder={placeholder}
            value={palette.search}
            onChange={(event) => palette.setSearch(event.target.value)}
            className={classNames(classes.root, className)}
            data-component="CommandPalette.Input"
            {...rest}
        />
    );
}

CommandPaletteInput.displayName = "CommandPalette.Input";

export default fixedForwardRef(CommandPaletteInput);
