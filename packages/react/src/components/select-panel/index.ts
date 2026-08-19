import SelectPanelBase from "./SelectPanel";
import SelectPanelButton from "./SelectPanelButton";
import SelectPanelFooter from "./SelectPanelFooter";
import SelectPanelHeader from "./SelectPanelHeader";
import SelectPanelLoading from "./SelectPanelLoading";
import SelectPanelMessage from "./SelectPanelMessage";
import SelectPanelSearchInput from "./SelectPanelSearchInput";
import SelectPanelSecondaryAction from "./SelectPanelSecondaryAction";

export const SelectPanel = Object.assign(SelectPanelBase, {
    Button: SelectPanelButton,
    Header: SelectPanelHeader,
    SearchInput: SelectPanelSearchInput,
    Footer: SelectPanelFooter,
    SecondaryAction: SelectPanelSecondaryAction,
    Loading: SelectPanelLoading,
    Message: SelectPanelMessage,
});

export {
    SelectPanelButton,
    SelectPanelHeader,
    SelectPanelSearchInput,
    SelectPanelFooter,
    SelectPanelSecondaryAction,
    SelectPanelLoading,
    SelectPanelMessage,
};
export { SelectPanelContext } from "./SelectPanelContext";
export * from "./SelectPanel.types";
