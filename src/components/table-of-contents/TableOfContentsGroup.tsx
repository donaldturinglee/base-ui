import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import TableOfContentsList from "./TableOfContentsList";
import type { TableOfContentsGroupProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-group",
    label: "table-of-contents-group-label",
    link: "table-of-contents-link",
    active: "table-of-contents-link-active",
    list: "table-of-contents-group-list",
};

// A run of sections standing under one of their own, stepped in from it so that a glance down
// the list says which sections belong to which.
//
// Where the label leads somewhere it is drawn as a section like any other; where it leads
// nowhere it is only words, and `onClick` is left off rather than put on the row: the row holds
// the sections below it as well, so a handler there would answer for their presses too
function TableOfContentsGroup(
    props: TableOfContentsGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { label, href, active = false, className, children, onClick, ...rest } = props;

    return (
        <li
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="TableOfContents.Group"
            {...rest}
        >
            {href ? (
                <a
                    href={href}
                    onClick={onClick}
                    aria-current={active ? "true" : undefined}
                    className={classNames(classes.link, active && classes.active)}
                    data-component="TableOfContents.Group.Label"
                >
                    {label}
                </a>
            ) : (
                <p className={classes.label} data-component="TableOfContents.Group.Label">
                    {label}
                </p>
            )}

            <TableOfContentsList className={classes.list}>{children}</TableOfContentsList>
        </li>
    );
}

TableOfContentsGroup.displayName = "TableOfContents.Group";

export default fixedForwardRef(TableOfContentsGroup);
