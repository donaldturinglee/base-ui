import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CardContext } from "./CardContext";
import type { CardHeadingProps } from "./Card.types";

const classes = {
    root: "card-heading",
    compact: "card-heading-compact",
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
