import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CardContext } from "./CardContext";
import type { CardIconProps } from "./Card.types";

const classes = {
    root: "card-icon",
    tile: "card-icon-tile",
};

function CardIcon(
    props: CardIconProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { icon: Icon, className, "aria-label": ariaLabel, ...rest } = props;
    const { layout } = React.useContext(CardContext);

    return (
        <span
            ref={ref}
            // An unlabelled icon is decorative, so it stays out of the accessibility tree
            role={ariaLabel ? "img" : undefined}
            aria-label={ariaLabel}
            aria-hidden={ariaLabel ? undefined : true}
            className={classNames(classes.root, layout !== "compact" && classes.tile, className)}
            data-component="Card.Icon"
            {...rest}
        >
            <Icon />
        </span>
    );
}

CardIcon.displayName = "Card.Icon";

export default fixedForwardRef(CardIcon);
