import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SelectOptionProps } from "./Select.types";

function SelectOption(
    props: SelectOptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    return <option ref={ref} data-component="Select.Option" {...props} />;
}

SelectOption.displayName = "Select.Option";

export default fixedForwardRef(SelectOption);
