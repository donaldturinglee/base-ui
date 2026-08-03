import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SeparatorOrientation, SeparatorProps, SeparatorVariant } from "./Separator.types";

const separatorVariants = cva("separator", {
    variants: {
        orientation: {
            horizontal: "separator-horizontal",
            vertical: "separator-vertical",
        } satisfies Record<SeparatorOrientation, string>,
        variant: {
            subtle: "separator-subtle",
            default: "separator-default",
            emphasis: "separator-emphasis",
        } satisfies Record<SeparatorVariant, string>,
    },
});

function Separator<As extends React.ElementType = "div">(
    props: SeparatorProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        orientation = "horizontal",
        variant = "default",
        ...rest
    } = props as SeparatorProps<"div">;

    return (
        <Component
            ref={ref}
            // The separator stands between one group of things and the next, and says which
            // way it runs whichever way that happens to be. A line that is only decoration can
            // be given `role="presentation"` instead
            role="separator"
            aria-orientation={orientation}
            className={classNames(separatorVariants({ orientation, variant }), className)}
            data-component="Separator"
            data-orientation={orientation}
            data-variant={variant}
            {...rest}
        />
    );
}

Separator.displayName = "Separator";

export default fixedForwardRef(Separator);
