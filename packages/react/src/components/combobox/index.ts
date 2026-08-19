import ComboboxBase from "./Combobox";
import ComboboxClearTrigger from "./ComboboxClearTrigger";
import ComboboxContent from "./ComboboxContent";
import ComboboxControl from "./ComboboxControl";
import ComboboxEmpty from "./ComboboxEmpty";
import ComboboxInput from "./ComboboxInput";
import ComboboxItem from "./ComboboxItem";
import ComboboxItemGroup from "./ComboboxItemGroup";
import ComboboxItemGroupLabel from "./ComboboxItemGroupLabel";
import ComboboxItemIndicator from "./ComboboxItemIndicator";
import ComboboxItemText from "./ComboboxItemText";
import ComboboxLabel from "./ComboboxLabel";
import ComboboxList from "./ComboboxList";
import ComboboxPositioner from "./ComboboxPositioner";
import ComboboxTrigger from "./ComboboxTrigger";

export const Combobox = Object.assign(ComboboxBase, {
    Label: ComboboxLabel,
    Control: ComboboxControl,
    Input: ComboboxInput,
    Trigger: ComboboxTrigger,
    ClearTrigger: ComboboxClearTrigger,
    Positioner: ComboboxPositioner,
    Content: ComboboxContent,
    List: ComboboxList,
    ItemGroup: ComboboxItemGroup,
    ItemGroupLabel: ComboboxItemGroupLabel,
    Item: ComboboxItem,
    ItemText: ComboboxItemText,
    ItemIndicator: ComboboxItemIndicator,
    Empty: ComboboxEmpty,
});

export {
    ComboboxLabel,
    ComboboxControl,
    ComboboxInput,
    ComboboxTrigger,
    ComboboxClearTrigger,
    ComboboxPositioner,
    ComboboxContent,
    ComboboxList,
    ComboboxItemGroup,
    ComboboxItemGroupLabel,
    ComboboxItem,
    ComboboxItemText,
    ComboboxItemIndicator,
    ComboboxEmpty,
};
export { ComboboxContext, ComboboxItemContext, ComboboxItemGroupContext } from "./ComboboxContext";
export * from "./Combobox.types";
