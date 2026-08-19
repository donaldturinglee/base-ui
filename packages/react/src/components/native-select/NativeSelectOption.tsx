import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { NativeSelectOptionProps } from "./NativeSelect.types";

function NativeSelectOption(
    props: NativeSelectOptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    return <option ref={ref} data-component="NativeSelect.Option" {...props} />;
}

NativeSelectOption.displayName = "NativeSelect.Option";

export default fixedForwardRef(NativeSelectOption);
