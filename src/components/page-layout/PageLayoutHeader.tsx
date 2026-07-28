import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { PageLayoutContext } from "./PageLayoutContext";
import PageLayoutHorizontalDivider from "./PageLayoutHorizontalDivider";
import type { PageLayoutHeaderProps } from "./PageLayout.types";

const classes = {
    root: "w-full mb-[var(--spacing)]",
    // A region can be taken away for good, or only within a range of viewports
    hidden: "data-[hidden=true]:hidden max-medium:data-[hidden-narrow=true]:hidden medium:data-[hidden-regular=true]:hidden xxlarge:data-[hidden-wide=true]:hidden",
    content: "p-[var(--spacing)]",
    divider: "mt-[var(--spacing)]",
};

function PageLayoutHeader(
    props: PageLayoutHeaderProps,
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
        <header
            ref={ref}
            className={classNames(classes.root, classes.hidden, className)}
            style={
                {
                    "--spacing": `var(--page-layout-spacing-${rowGap})`,
                    ...style,
                } as React.CSSProperties
            }
            data-component="PageLayout.Header"
            {...getResponsiveAttributes("hidden", hidden)}
            {...rest}
        >
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
            <PageLayoutHorizontalDivider
                variant={divider}
                className={classes.divider}
                style={
                    {
                        "--spacing": `var(--page-layout-spacing-${rowGap})`,
                    } as React.CSSProperties
                }
            />
        </header>
    );
}

PageLayoutHeader.displayName = "PageLayout.Header";

export default fixedForwardRef(PageLayoutHeader);
