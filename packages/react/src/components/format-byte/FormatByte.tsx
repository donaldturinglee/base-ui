import * as React from "react";
import { useLocaleContext } from "../../providers/locale";
import { formatBytes } from "../../utilities/i18n";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { FormatByteProps } from "./FormatByte.types";

// A size written the way it would be read aloud rather than as the count of bytes behind it, so
// that an upload of 1500 bytes reads as 1.5 kB. The unit is named and placed by the locale along
// with the number, since not every language writes it the way English does
function FormatByte<As extends React.ElementType = "span">(
    props: FormatByteProps<As>,
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
    } = props as unknown as FormatByteProps<"span">;

    const { locale: activeLocale } = useLocaleContext();

    return (
        <Component ref={ref} data-component="FormatByte" {...rest}>
            {/* Children stand in for the reading, so a size whose locale is only settled in the
                browser can be handed over already written out */}
            {children ?? formatBytes(value, locale ?? activeLocale, format)}
        </Component>
    );
}

FormatByte.displayName = "FormatByte";

export default fixedForwardRef(FormatByte);
