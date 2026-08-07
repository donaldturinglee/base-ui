import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { EmProps, EmSize, EmWeight } from "./Em.types";

const emVariants = cva("em", {
    variants: {
        size: {
            large: "em-size-large",
            medium: "em-size-medium",
            small: "em-size-small",
        } satisfies Record<EmSize, string>,
        weight: {
            light: "em-weight-light",
            normal: "em-weight-normal",
            medium: "em-weight-medium",
            semibold: "em-weight-semibold",
        } satisfies Record<EmWeight, string>,
    },
});

// A word or two given the stress of the line they are read in. Neither size nor weight is
// answered here unless a caller asks for one, so the emphasis takes the type of whatever it
// sits within rather than setting a size of its own against it
function Em<As extends React.ElementType = "em">(
    props: EmProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "em", className, size, weight, ...rest } = props as EmProps<"em">;

    return (
        <Component
            ref={ref}
            className={classNames(emVariants({ size, weight }), className)}
            data-component="Em"
            data-size={size}
            data-weight={weight}
            {...rest}
        />
    );
}

Em.displayName = "Em";

export default fixedForwardRef(Em);
