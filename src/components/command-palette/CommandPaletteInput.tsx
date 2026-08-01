import * as React from "react";
import { SearchRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TextInput } from "../text-input";
import { CommandPaletteContext } from "./CommandPaletteContext";
import type { CommandPaletteInputProps } from "./CommandPalette.types";

const classes = {
    // The field is the top of the panel rather than a control standing inside it, so it gives
    // up its own border and takes a line under it instead
    root: "shrink-0 rounded-none border-0 border-b-[length:var(--border-width-thin)] border-b-[color:var(--border-color-default)] [box-shadow:none] focus-within:outline-none",
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
