import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CardDescriptionProps } from "./Card.types";

const classes = {
    root: "card-description text-body-medium",
};

function CardDescription(
    props: CardDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <p
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Card.Description"
            {...rest}
        />
    );
}

CardDescription.displayName = "Card.Description";

export default fixedForwardRef(CardDescription);
