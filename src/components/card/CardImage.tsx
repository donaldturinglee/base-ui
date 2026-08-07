import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CardImageProps } from "./Card.types";

const classes = {
    root: "card-image",
};

function CardImage(
    props: CardImageProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, alt = "", ...rest } = props;

    return (
        <img
            ref={ref}
            alt={alt}
            className={classNames(classes.root, className)}
            data-component="Card.Image"
            {...rest}
        />
    );
}

CardImage.displayName = "Card.Image";

export default fixedForwardRef(CardImage);
