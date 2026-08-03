import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { PageLayoutContext } from "./PageLayoutContext";
import PageLayoutHorizontalDivider from "./PageLayoutHorizontalDivider";
import type { PageLayoutFooterProps } from "./PageLayout.types";

const classes = {
    root: "page-layout-footer",
    hidden: "page-layout-hidden",
    divider: "page-layout-footer-divider",
    content: "page-layout-region-content",
};

function PageLayoutFooter(
    props: PageLayoutFooterProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        children,
        padding = "none",
        divider = "none",
        hidden = false,
        ...rest
    } = props;

    const { rowGap } = React.useContext(PageLayoutContext);

    return (
        <footer
            ref={ref}
            className={classNames(classes.root, classes.hidden, className)}
            style={
                {
                    "--spacing": `var(--page-layout-spacing-${rowGap})`,
                    ...style,
                } as React.CSSProperties
            }
            data-component="PageLayout.Footer"
            {...getResponsiveAttributes("hidden", hidden)}
            {...rest}
        >
            <PageLayoutHorizontalDivider
                variant={divider}
                className={classes.divider}
                style={
                    {
                        "--spacing": `var(--page-layout-spacing-${rowGap})`,
                    } as React.CSSProperties
                }
            />
            <div
                className={classes.content}
                style={
                    {
                        "--spacing": `var(--page-layout-spacing-${padding})`,
                    } as React.CSSProperties
                }
            >
                {children}
            </div>
        </footer>
    );
}

PageLayoutFooter.displayName = "PageLayout.Footer";

export default fixedForwardRef(PageLayoutFooter);
