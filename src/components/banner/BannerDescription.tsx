import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BannerDescriptionProps } from "./Banner.types";

function BannerDescription(
    props: BannerDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    // The description takes the banner's own type and spacing, so it carries no styling of
    // its own
    return (
        <div
            ref={ref}
            className={classNames(className)}
            data-component="Banner.Description"
            {...rest}
        />
    );
}

BannerDescription.displayName = "Banner.Description";

export default fixedForwardRef(BannerDescription);
