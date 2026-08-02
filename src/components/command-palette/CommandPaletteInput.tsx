import * as React from "react";
import { SearchRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TextInput } from "../text-input";
import { CommandPaletteContext } from "./CommandPaletteContext";
import type { CommandPaletteInputProps } from "./CommandPalette.types";

const classes = {
    // The field is the top of the panel rather than a control standing inside it, so it gives
    // up its border and its ring alike and nothing is drawn between it and the list: the room
    // either side of them is what holds them apart. It is set larger and taller than an
    // ordinary field, since it is the one thing on the panel that is typed into. It is stood
    // off either edge far enough that the magnifier starts where the headings and the items
    // below it start, and what is typed ends where their text ends, so the whole panel reads
    // down one edge
    root: "shrink-0 min-h-[var(--control-xlarge-size)] ps-[var(--base-size-16)] pe-[var(--base-size-8)] rounded-none border-0 [box-shadow:none] [font-size:var(--text-body-size-large)] focus-within:outline-none",
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
