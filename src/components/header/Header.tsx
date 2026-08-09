import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { HeaderProps } from "./Header.types";

const classes = {
    root: "header",
};

// The row that runs across the top of the page, holding what the reader needs wherever in
// the site they are
function Header<As extends React.ElementType = "header">(
    props: HeaderProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "header", className, ...rest } = props as HeaderProps<"header">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Header"
            {...rest}
        />
    );
}

Header.displayName = "Header";

export default fixedForwardRef(Header);
