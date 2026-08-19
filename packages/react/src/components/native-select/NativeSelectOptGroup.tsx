import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { NativeSelectOptGroupProps } from "./NativeSelect.types";

function NativeSelectOptGroup(
    props: NativeSelectOptGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    return <optgroup ref={ref} data-component="NativeSelect.OptGroup" {...props} />;
}

NativeSelectOptGroup.displayName = "NativeSelect.OptGroup";

export default fixedForwardRef(NativeSelectOptGroup);
