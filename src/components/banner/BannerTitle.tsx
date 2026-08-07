import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { BannerContext } from "./BannerContext";
import type { BannerTitleProps } from "./Banner.types";

const classes = {
    root: "banner-title",
};

function BannerTitle(
    props: BannerTitleProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h2", className, id, ...rest } = props;
    const { titleId } = React.useContext(BannerContext);

    return (
        <Component
            ref={ref}
            // The banner names its region after this element, so it takes the id the banner
            // is already pointing at unless the caller has named one of their own
            id={id ?? titleId}
            className={classNames(classes.root, className)}
            data-component="Banner.Title"
            {...rest}
        />
    );
}

BannerTitle.displayName = "Banner.Title";

export default fixedForwardRef(BannerTitle);
