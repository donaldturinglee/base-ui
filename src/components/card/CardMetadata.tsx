import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CardMetadataProps } from "./Card.types";

const classes = {
    root: "flex items-center gap-[var(--stack-gap-condensed)] [color:var(--foreground-color-muted)] [font-family:var(--font-stack-sans-serif)] [font-weight:var(--text-body-weight)] [font-size:var(--text-body-size-small)] [line-height:var(--text-body-line-height-small)]",
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
