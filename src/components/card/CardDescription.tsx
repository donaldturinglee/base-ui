import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CardDescriptionProps } from "./Card.types";

const classes = {
    root: "m-0 text-body-medium [color:var(--foreground-color-muted)]",
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
