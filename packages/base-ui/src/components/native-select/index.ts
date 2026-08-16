import NativeSelectBase from "./NativeSelect";
import NativeSelectOptGroup from "./NativeSelectOptGroup";
import NativeSelectOption from "./NativeSelectOption";

export const NativeSelect = Object.assign(NativeSelectBase, {
    Option: NativeSelectOption,
    OptGroup: NativeSelectOptGroup,
});

export { NativeSelectOption, NativeSelectOptGroup };
export * from "./NativeSelect.types";
