import * as React from "react";
import { ArrowUploadRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { UploadIconProps } from "./Upload.types";

const classes = {
    // The mark is sized by the control it stands in, so a small drop zone is not led by an
    // icon drawn for a large one
    root: "flex items-center justify-center [color:var(--upload-muted-color,var(--foreground-color-muted))] [&>svg]:size-[var(--upload-icon-size,var(--base-size-24))]",
};

function UploadIcon(
    props: UploadIconProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { icon: Icon = ArrowUploadRegular, className, "aria-label": ariaLabel, ...rest } = props;

    return (
        <span
            ref={ref}
            // An unlabelled icon is decorative, so it stays out of the accessibility tree
            role={ariaLabel ? "img" : undefined}
            aria-label={ariaLabel}
            aria-hidden={ariaLabel ? undefined : true}
            className={classNames(classes.root, className)}
            data-component="Upload.Icon"
            {...rest}
        >
            <Icon />
        </span>
    );
}

UploadIcon.displayName = "Upload.Icon";

export default fixedForwardRef(UploadIcon);
