import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CardActionProps } from "./Card.types";

const classes = {
    // Sits over the card's own content in the top corner
    root: "absolute top-[var(--base-size-16)] right-[var(--base-size-16)] z-1",
};

function CardAction(
    props: CardActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Card.Action"
            {...rest}
        />
    );
}

CardAction.displayName = "Card.Action";

export default fixedForwardRef(CardAction);
