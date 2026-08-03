import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CardContext } from "./CardContext";
import type { CardHeadingProps } from "./Card.types";

const classes = {
    root: "m-0 text-foreground-default [font-family:var(--font-stack-sans-serif)] [font-weight:var(--text-title-weight-small)] [font-size:var(--text-title-size-small)] [line-height:var(--text-title-line-height-small)]",
    // A compact heading drops to body size and lifts to sit level with the icon beside it
    compact: "relative top-[calc(-1*var(--base-size-4))] [font-size:var(--text-body-size-medium)]",
};

function CardHeading(
    props: CardHeadingProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h3", className, id, ...rest } = props;
    const { titleId, layout } = React.useContext(CardContext);

    return (
        <Component
            ref={ref}
            // A standalone card names its landmark from this heading, so it needs the id
            id={id ?? titleId}
            className={classNames(classes.root, layout === "compact" && classes.compact, className)}
            data-component="Card.Heading"
            {...rest}
        />
    );
}

CardHeading.displayName = "Card.Heading";

export default fixedForwardRef(CardHeading);
