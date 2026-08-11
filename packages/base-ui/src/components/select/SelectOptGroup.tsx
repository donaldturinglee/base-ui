import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SelectOptGroupProps } from "./Select.types";

function SelectOptGroup(
    props: SelectOptGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    return <optgroup ref={ref} data-component="Select.OptGroup" {...props} />;
}

SelectOptGroup.displayName = "Select.OptGroup";

export default fixedForwardRef(SelectOptGroup);
