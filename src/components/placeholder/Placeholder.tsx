import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { PlaceholderProps } from "./Placeholder.types";

const classes = {
    root: "grid place-items-center px-[var(--base-size-24)] py-[var(--base-size-4)] bg-[var(--background-color-inset)] rounded-[var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--border-color-muted)]",
    dimensions: "w-[var(--placeholder-width,100%)] h-[var(--placeholder-height)]",
};

function Placeholder<As extends React.ElementType = "div">(
    props: PlaceholderProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        width,
        height,
        label,
        style,
        children,
        ...rest
        // `height` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as PlaceholderProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.dimensions, className)}
            style={
                {
                    ...style,
                    // The width fallback lives in the class, so leaving this unset renders full width
                    "--placeholder-width": width,
                    "--placeholder-height": height,
                } as React.CSSProperties
            }
            data-component="Placeholder"
            {...rest}
        >
            {children ?? label}
        </Component>
    );
}

Placeholder.displayName = "Placeholder";

export default fixedForwardRef(Placeholder);
