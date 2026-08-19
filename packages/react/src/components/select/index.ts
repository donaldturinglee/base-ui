import SelectBase from "./Select";
import SelectOptGroup from "./SelectOptGroup";
import SelectOption from "./SelectOption";

export const Select = Object.assign(SelectBase, {
    Option: SelectOption,
    OptGroup: SelectOptGroup,
});

export { SelectOption, SelectOptGroup };
export { SelectContext } from "./SelectContext";
export { SelectOptGroupContext } from "./SelectOptGroupContext";
export * from "./Select.types";
