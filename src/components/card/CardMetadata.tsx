import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CardMetadataProps } from "./Card.types";

const classes = {
    root: "flex items-center gap-[var(--stack-gap-condensed)] text-body-small [color:var(--foreground-color-muted)]",
};

function CardMetadata(
    props: CardMetadataProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Card.Metadata"
            {...rest}
        />
    );
}

CardMetadata.displayName = "Card.Metadata";

export default fixedForwardRef(CardMetadata);
