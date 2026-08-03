import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TruncateProps } from "./Truncate.types";

export const DEFAULT_TRUNCATE_MAX_WIDTH = 125;

const classes = {
    root: "truncate-text",
    block: "truncate-text-block",
    inline: "inline-block align-top",
    expandable: "truncate-text-expandable",
};

function Truncate<As extends React.ElementType = "div">(
    props: TruncateProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        title,
        maxWidth = DEFAULT_TRUNCATE_MAX_WIDTH,
        inline,
        expandable,
        style,
        ...rest
        // `title` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as TruncateProps<"div">;

    return (
        <Component
            ref={ref}
            title={title}
            className={classNames(
                classes.root,
                inline ? classes.inline : classes.block,
                expandable && classes.expandable,
                className,
            )}
            style={
                {
                    ...style,
                    "--truncate-max-width":
                        typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
                } as React.CSSProperties
            }
            data-component="Truncate"
            data-inline={inline}
            data-expandable={expandable}
            {...rest}
        />
    );
}

Truncate.displayName = "Truncate";

export default fixedForwardRef(Truncate);
