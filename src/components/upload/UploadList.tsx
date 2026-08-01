import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { UploadListProps } from "./Upload.types";

const classes = {
    // A list drawn without its markers is no longer read as one in every browser, so the role
    // below puts back what the styling takes away
    root: "grid gap-[var(--stack-gap-condensed)] m-0 p-0 list-none",
};

function UploadList(
    props: UploadListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    // Nothing to show, not even an empty list
    if (React.Children.toArray(children).length === 0) {
        return null;
    }

    return (
        <ul
            ref={ref}
            role="list"
            className={classNames(classes.root, className)}
            data-component="Upload.List"
            {...rest}
        >
            {children}
        </ul>
    );
}

UploadList.displayName = "Upload.List";

export default fixedForwardRef(UploadList);
