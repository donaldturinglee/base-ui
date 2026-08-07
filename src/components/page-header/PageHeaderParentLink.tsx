import * as React from "react";
import { ArrowLeftRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Link } from "../link";
import { getHiddenAttribute, getHiddenClassName, getHiddenViewports } from "./visibility";
import type { PageHeaderParentLinkProps } from "./PageHeader.types";

const classes = {
    root: "page-header-parent-link",
};

// Goes back up a level, for a reader who has no breadcrumbs to climb. It stands in the
// context area, so like the rest of it only a narrow viewport is given it by default
function PageHeaderParentLink<As extends React.ElementType = "a">(
    props: PageHeaderParentLinkProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        hidden = { regular: true, wide: true },
        ...rest
    } = props as PageHeaderParentLinkProps<"a">;

    const hiddenViewports = getHiddenViewports(hidden);

    return (
        <Link
            ref={ref}
            muted
            // The hiding comes last, so that it stands over the layout rather than the other
            // way round
            className={classNames(classes.root, className, getHiddenClassName(hiddenViewports))}
            data-component="PageHeader.ParentLink"
            data-hidden={getHiddenAttribute(hiddenViewports)}
            {...rest}
        >
            <ArrowLeftRegular />
            <span>{children}</span>
        </Link>
    );
}

PageHeaderParentLink.displayName = "PageHeader.ParentLink";

export default fixedForwardRef(PageHeaderParentLink);
