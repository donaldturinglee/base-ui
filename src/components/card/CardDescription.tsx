import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CardDescriptionProps } from "./Card.types";

const classes = {
    root: "m-0 [color:var(--foreground-color-muted)] [font-family:var(--font-stack-sans-serif)] [font-weight:var(--text-body-weight)] [font-size:var(--text-body-size-medium)] [line-height:var(--text-body-line-height-medium)]",
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
