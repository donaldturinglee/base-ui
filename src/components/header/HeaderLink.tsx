import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { HeaderLinkProps } from "./Header.types";

const classes = {
    root: "header-link",
};

// Somewhere the row leads to. It is drawn brighter than the rest of the row, which is what
// makes it read as the name of the site rather than as one more thing standing in the row
function HeaderLink<As extends React.ElementType = "a">(
    props: HeaderLinkProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "a", className, ...rest } = props as HeaderLinkProps<"a">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Header.Link"
            {...rest}
        />
    );
}

HeaderLink.displayName = "Header.Link";

export default fixedForwardRef(HeaderLink);
