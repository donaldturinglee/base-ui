import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { UploadContext } from "./UploadContext";
import type { UploadLabelProps } from "./Upload.types";

const classes = {
    root: "[font-size:var(--upload-label-size,var(--text-body-size-medium))] [font-weight:var(--base-text-weight-semibold)] [line-height:var(--text-body-line-height-medium)]",
};

function UploadLabel(
    props: UploadLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { labelId } = React.useContext(UploadContext);

    return (
        <span
            ref={ref}
            // The control is named after this line, so it takes the id the control is already
            // pointing at unless the caller has named one of their own
            id={id ?? labelId}
            className={classNames(classes.root, className)}
            data-component="Upload.Label"
            {...rest}
        />
    );
}

UploadLabel.displayName = "Upload.Label";

export default fixedForwardRef(UploadLabel);
