import CommandPaletteBase from "./CommandPalette";
import CommandPaletteDialog from "./CommandPaletteDialog";
import CommandPaletteEmpty from "./CommandPaletteEmpty";
import CommandPaletteGroup from "./CommandPaletteGroup";
import CommandPaletteInput from "./CommandPaletteInput";
import CommandPaletteItem from "./CommandPaletteItem";
import CommandPaletteList from "./CommandPaletteList";
import CommandPaletteLoading from "./CommandPaletteLoading";
import CommandPaletteSeparator from "./CommandPaletteSeparator";

export const CommandPalette = Object.assign(CommandPaletteBase, {
    Dialog: CommandPaletteDialog,
    Input: CommandPaletteInput,
    List: CommandPaletteList,
    Group: CommandPaletteGroup,
    Item: CommandPaletteItem,
    Separator: CommandPaletteSeparator,
    Empty: CommandPaletteEmpty,
    Loading: CommandPaletteLoading,
});

export {
    CommandPaletteDialog,
    CommandPaletteInput,
    CommandPaletteList,
    CommandPaletteGroup,
    CommandPaletteItem,
    CommandPaletteSeparator,
    CommandPaletteEmpty,
    CommandPaletteLoading,
};
export { CommandPaletteContext, CommandPaletteGroupContext } from "./CommandPaletteContext";
export { commandScore } from "./commandScore";
export * from "./CommandPalette.types";
