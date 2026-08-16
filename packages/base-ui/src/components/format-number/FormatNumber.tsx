import * as React from "react";
import { useNumberFormatter } from "../../providers/locale";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { FormatNumberProps } from "./FormatNumber.types";

// A number written the way the reader reads it. Where the grouping falls, which mark separates
// the decimals and which side the currency or the unit sits on are the locale's to settle, so a
// figure written into the page from a source that knows none of that still reads properly
function FormatNumber<As extends React.ElementType = "span">(
    props: FormatNumberProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        children,
        value,
        format,
        locale,
        ...rest
        // `value` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as FormatNumberProps<"span">;

    const formatter = useNumberFormatter({ locale, ...format });

    return (
        <Component ref={ref} data-component="FormatNumber" {...rest}>
            {/* Children stand in for the reading, so a figure whose locale is only settled in the
                browser can be handed over already written out */}
            {children ?? formatter.format(value)}
        </Component>
    );
}

FormatNumber.displayName = "FormatNumber";

export default fixedForwardRef(FormatNumber);
