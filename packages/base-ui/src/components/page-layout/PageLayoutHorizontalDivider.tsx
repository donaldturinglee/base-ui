import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { PageLayoutContext } from "./PageLayoutContext";
import type { PageLayoutDividerProps } from "./PageLayout.types";

// The four sets below say the same thing four times over: once for a variant given plainly,
// and once for each viewport range it can be given one at a time. They are written out in
// full because a class name only reaches the stylesheet if it appears here as it stands
const classes = {
    root: "page-layout-horizontal-divider",
};

function PageLayoutHorizontalDivider(
    props: PageLayoutDividerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, style, variant = "none", position, ...rest } = props;
    const { padding } = React.useContext(PageLayoutContext);

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            style={
                {
                    "--spacing-divider": `var(--page-layout-spacing-${padding})`,
                    ...style,
                } as React.CSSProperties
            }
            data-component="PageLayout.HorizontalDivider"
            {...getResponsiveAttributes("variant", variant)}
            {...getResponsiveAttributes("position", position)}
            {...rest}
        />
    );
}

PageLayoutHorizontalDivider.displayName = "PageLayout.HorizontalDivider";

export default fixedForwardRef(PageLayoutHorizontalDivider);
